from pathlib import Path
from urllib.parse import urlparse, unquote
from html.parser import HTMLParser
import json
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]/'dist'
errors=[]
class Page(HTMLParser):
    def __init__(self,file):
        super().__init__(convert_charrefs=True)
        self.file=file; self.ids=set(); self.references=[]; self.h1=0; self.title=0; self.json_ld=False; self.json_parts=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:
            if a['id'] in self.ids: errors.append(f'{self.file.name}: duplicate id {a["id"]}')
            self.ids.add(a['id'])
        if tag=='h1': self.h1+=1
        if tag=='title': self.title+=1
        for attr in ('src','href'):
            if attr in a: self.references.append(a[attr])
        if tag=='img' and 'alt' not in a: errors.append(f'{self.file.name}: image missing alt')
        if tag=='a' and a.get('target')=='_blank' and 'noopener' not in a.get('rel',''): errors.append(f'{self.file.name}: unsafe external link')
        if tag=='html' and a.get('lang')!='vi': errors.append(f'{self.file.name}: lang is not Vietnamese')
        if tag=='script' and a.get('type')=='application/ld+json': self.json_ld=True;self.json_parts=[]
    def handle_data(self,data):
        if self.json_ld:self.json_parts.append(data)
    def handle_endtag(self,tag):
        if tag=='script' and self.json_ld:
            try:json.loads(''.join(self.json_parts))
            except Exception as e:errors.append(f'{self.file.name}: JSON-LD invalid: {e}')
            self.json_ld=False

pages={}
for file in ROOT.rglob('*.html'):
    p=Page(file);p.feed(file.read_text());pages[file.resolve()]=p
    if p.title!=1:errors.append(f'{file.name}: requires one title')
    if p.h1!=1 and file.name!='doc-bai.html':errors.append(f'{file.name}: requires one h1, found {p.h1}')
for file,p in pages.items():
    for ref in p.references:
        u=urlparse(ref)
        if u.scheme or ref.startswith('//'):continue
        if u.path:
            target=(file.parent/unquote(u.path)).resolve()
            if not target.is_relative_to(ROOT.resolve()):errors.append(f'{file.name}: link leaves site {ref}');continue
            if not target.is_file():errors.append(f'{file.name}: missing file {ref}');continue
        else:target=file
        if u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:errors.append(f'{file.name}: missing anchor {ref}')
for svg in (ROOT/'assets').glob('*.svg'):
    try:ET.parse(svg)
    except Exception as e:errors.append(f'{svg.name}: invalid SVG: {e}')
ET.parse(ROOT/'sitemap.xml')
if errors:raise SystemExit('\n'.join(errors))
print(f'Validated {len(pages)} HTML pages: assets, internal links, anchors, headings, JSON-LD and SVG XML all pass.')
