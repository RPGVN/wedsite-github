# Tech Horizon 6.0

Website tiếng Việt của kênh Tech Horizon, dựa trên tên, thông điệp và tông màu trong ảnh chủ kênh cung cấp. Chạy bằng HTML/CSS/JavaScript, không cần cài thư viện, cơ sở dữ liệu hoặc khóa API.

## Nâng cấp trải nghiệm 6.0

- **Bạn có 5 phút?** xuất hiện trong phần mở đầu trước ảnh trên điện thoại. Chọn chủ đề để mở ngay cẩm nang thật; nếu có bài đang đọc phù hợp, tiếp tục từ tiến độ trên thiết bị. Nếu không có bài dưới 5 phút, thời gian thực của bài ngắn nhất được ghi rõ.
- **Gợi ý có thứ tự**: một bài nên đọc trước, hai góc nhìn khác và điều bạn mang theo từ mỗi bài. Ba mục tiêu Hiểu từ đầu / Thử làm ngay / Tránh nhầm lẫn có thứ tự biên tập riêng. Bộ lọc vẫn tôn trọng chủ đề và thời gian. Khi không có bài phù hợp, một nút chuyển sang mốc thời gian có bài thật.
- **Chia sẻ lựa chọn**: sao chép liên kết mở đúng chủ đề, mục tiêu và thời gian, không kèm ghi chú, tiến độ hoặc bản nháp cá nhân.
- **Trạm thực hành** (`dist/thuc-hanh.html`): bốn nhiệm vụ nối cẩm nang với Studio. Mỗi nhiệm vụ có mục tiêu, việc cần thử, ba mục tự đối chiếu và phiếu TXT chứa ghi chép của bạn. Dấu chọn/ghi chép chỉ ở lần mở trang hiện tại; cẩm nang và Studio mở ở tab mới để giữ phiếu. Tải TXT để lưu lâu dài. Phiếu không nằm trong bản sao lưu thiết bị.
- **Mạch đọc và làm**: cuối mỗi bài có hướng thực hành và cẩm nang tiếp theo trong lộ trình nếu có. Studio nhận liên kết nhiệm vụ sẽ hiện lại hướng dẫn và đường trở về phiếu, giữ nguyên thông tin bạn đã nhập trong công cụ.
- Bố cục mới cho gợi ý đọc, vùng nhiệm vụ, trang thực hành và các trạng thái trống; tăng cỡ chữ và vùng bấm trong các phần mới. Giữ hình chủ đạo, các đường dẫn, sáu công cụ Studio và mọi chức năng biên tập/sao lưu.

## Nâng cấp trải nghiệm 5.0

- Trang chủ mới theo hướng tạp chí công nghệ: hình chủ đạo vòng kim loại/kính mở ra chân trời ánh sáng, bố cục chữ lớn và các liên kết nổi trên ảnh. Ảnh Runway được tối ưu WebP khoảng 64 KB; ảnh Canva dùng như một minh họa nhỏ trong thẻ góc Lab.
- **Khám phá theo gu**: chọn chủ đề, mục tiêu tìm hiểu/thực hành và thời gian; gợi ý tối đa ba bài có thật, đúng giới hạn thời gian. Có một lựa chọn bài bất ngờ trong tập đang chọn, không đoán sở thích bằng AI và không ghi thêm dữ liệu cá nhân.
- **Giải mã nhanh**: ba tình huống HTTPS, RAM/lưu trữ và kiểm chứng AI; bấm chọn để xem giải thích, mở cẩm nang và nguồn. Tiến độ ở trong lượt mở trang, không tạo bảng xếp hạng hay phản hồi cộng đồng giả.
- Bố cục và chi tiết giao diện được làm mới cho cẩm nang, chuyên mục, lộ trình, Studio, thư viện và các trang quản lý. Điều hướng có hành động Khám phá khi chưa cấu hình Facebook.
- Chuyển động nhẹ, phản hồi khi rê chuột và hiệu ứng khi nội dung vào màn hình; có nút Giảm chuyển động, tôn trọng tùy chọn của thiết bị và website. Nội dung vẫn nhìn thấy nếu hiệu ứng không chạy.
- Giữ toàn bộ công cụ phiên bản 4, xuất ZIP và đường dẫn bài viết. Các ảnh/tệp chạy cục bộ trong gói; không thêm thư viện ngoài hoặc trình theo dõi.

## Nâng cấp 4.0


- **Trạm điều hành** (`dist/dieu-hanh.html`): lập kế hoạch có dàn ý, nguồn, định dạng và ngày giờ Việt Nam; bảng 5 trạng thái; lịch tháng; lọc tìm kiếm; sửa, nhân bản, xóa. Xuất ICS tạo sự kiện 30 phút để bạn tự nhập vào ứng dụng lịch; xuất CSV giữ tiếng Việt. Lịch không tự đăng bài Facebook hoặc gửi nhắc việc.
- **Studio 6 công cụ**: thêm chuẩn bị ảnh (PNG/JPEG/WebP, cắt giữa khung, 4 tỷ lệ, chiều rộng 64–2048 px, chất lượng tùy chọn) và ước tính thời lượng kịch bản. Ảnh đầu vào tối đa 15 MB / 40 megapixel; ảnh không gửi lên dịch vụ xử lý. Giữ trong suốt khi xuất PNG/WebP; nền trắng khi xuất JPEG. Canvas phụ thuộc trình duyệt, không thể tạo thêm chi tiết thật từ ảnh nhỏ.
- **Dữ liệu & hiển thị** (`dist/du-lieu.html`): sao lưu và khôi phục 5 nhóm dữ liệu; xem tệp trước khi nhập; kiểm tra định dạng; khôi phục có hoàn lại khi lưu lỗi; xóa theo nhóm. Bản sao lưu thiết bị chứa nội dung riêng, khác với ZIP website công khai.
- **Tùy chỉnh khả năng đọc**: tăng cỡ giao diện, tăng tương phản, giảm chuyển động; áp dụng cả trong bàn biên tập. Menu dài trên điện thoại có thể cuộn.
- **Giới thiệu & hợp tác** (`dist/gioi-thieu.html`): hồ sơ kênh từ nội dung thật, tải TXT và soạn đề xuất liên hệ. Chỉ mở ứng dụng email khi chủ kênh đã điền email; không tự gửi tin nhắn hoặc bịa số người theo dõi.
- **Hướng dẫn vận hành** (`dist/huong-dan.html`): thiết lập thương hiệu, quy trình nội dung, chuẩn bị ảnh, xuất bản, sao lưu, giới hạn hoạt động. Kiểm tra cấu hình ở trung tâm dữ liệu đọc bản nháp đã lưu nếu có.
- Tránh ghi đè kế hoạch khi tab khác đã thay đổi; cảnh báo khi dữ liệu lịch không đọc được. Có tải dữ liệu thô để giữ lại trước khi phục hồi thủ công.

## Những chức năng giữ từ 3.0


- Bốn công cụ Studio ban đầu: ghép mẫu prompt, đổi Mbps/MB/s và tính thời gian tải, tạo URL có UTM, danh sách tự rà soát trước khi đăng.
- Tìm kiếm tổng hợp trong cẩm nang, thuật ngữ, lộ trình và công cụ; có lọc phạm vi và điều hướng bằng bàn phím.
- Đổi logo, ảnh bìa trang chủ và ảnh riêng từng cẩm nang bằng tệp PNG/JPEG/WebP. Ảnh được nhúng cùng dữ liệu, không phụ thuộc dịch vụ ảnh ngoài. Giới hạn: logo 150 KB, bìa 400 KB, mỗi ảnh bài 250 KB. Nhiều ảnh lớn có thể chạm giới hạn bộ nhớ trình duyệt; hãy sao lưu JSON và ưu tiên ảnh đã tối ưu.
- Lịch sử giữ tối đa ba trạng thái biên tập trước đó, trong giới hạn dung lượng. Khôi phục chỉ thay bản nháp trên trình duyệt; bản online cần được xuất và triển khai lại.
- Prompt là mẫu để bạn mang sang công cụ AI, không phải phản hồi từ mô hình. Bộ tính tải tệp là ước lượng từ số nhập, không đo mạng thật. Công cụ UTM không bật thống kê hoặc tự mở URL. Danh sách rà soát không phải chứng nhận nội dung đúng.

## Mở ngay

Giải nén toàn bộ thư mục. Mở `index.html` ở thư mục gốc hoặc nhấp đúp `MO_WEBSITE.bat` trên Windows. Website thực tế nằm trong `dist/`.

Nếu máy có Node.js 20.11 trở lên, chạy `npm start` rồi mở `http://localhost:8080`. Máy chủ đi kèm chỉ lắng nghe trên máy cục bộ. Dừng bằng Ctrl + C.

## Có gì trong website

- Trang chủ tạp chí công nghệ với nội dung nổi bật, chuyên mục, cẩm nang, lộ trình, cộng đồng, từ điển và câu hỏi thường gặp.
- **16 cẩm nang**, **4 chuyên mục** có trang riêng, **4 lộ trình đọc** và **20 thuật ngữ** có nguồn để đọc thêm.
- Tìm kiếm tiếng Việt có dấu/không dấu, lọc chuyên mục, sắp xếp, xem thêm và lưu bài.
- Góc đọc: chỉnh cỡ chữ, chế độ tập trung, mục lục, tiến độ, chia sẻ, in hoặc lưu PDF qua trình duyệt.
- Nghe bài bằng giọng có sẵn trên thiết bị. Cần trình duyệt hỗ trợ speechSynthesis và có giọng tiếng Việt; nếu thiếu, website thông báo rõ.
- Ghi chú cá nhân tự lưu trên trình duyệt và nút đánh dấu đọc xong.
- Thư viện riêng gồm bài đã lưu, đang đọc, đã đọc và ghi chú. Có xuất/khôi phục JSON, tiếp tục đọc và xóa dữ liệu cá nhân.
- Bàn biên tập có kiểm tra cấu hình, tìm kiếm, lọc, nhân bản, thêm/sửa/xóa bài, chọn minh họa, chọn bài nổi bật và xem trước.
- Tab Bài từ Facebook để thêm đường dẫn bài thật hoặc Reels, tiêu đề và mô tả. Website không tự lấy video hoặc chỉ số Facebook.
- **Xuất toàn bộ website ZIP ngay trong bàn biên tập**. Gói có HTML cho từng bài, tài nguyên, sitemap, RSS và công cụ biên tập để sửa tiếp. Không cần dịch vụ biên dịch hoặc chạy lệnh để xuất ZIP.
- Metadata, Open Graph, JSON-LD, favicon, sitemap.xml, feed.xml, quyền riêng tư, 404, sáng/tối, menu điện thoại và hỗ trợ giảm chuyển động.

## Bổ sung Facebook

Ảnh không có URL/ID trang Facebook chính thức. Website không tự đoán liên kết hoặc gắn một trang trùng tên.

1. Mở `dist/bien-tap.html`, chọn Thông tin kênh.
2. Dán link Facebook chính thức và email công khai nếu muốn.
3. Lưu bản nháp, rồi Xem trước để kiểm tra.
4. Nhấn Xuất toàn bộ website ZIP.
5. Giải nén gói mới, mở `Tech_Horizon_Website/index.html`. Để xuất bản, tải nội dung thư mục website trong ZIP lên hosting web tĩnh.

Tải ZIP xuống không tự cập nhật website đang chạy online. Khi đổi tên miền, cập nhật trường Địa chỉ website trước khi xuất để liên kết chia sẻ và metadata trỏ đúng nơi.

## Sửa và thêm nội dung

Trong tab Cẩm nang, chọn bài hoặc nhấn Viết cẩm nang mới. Mỗi phần gồm một dòng tiêu đề và các dòng nội dung; ngăn hai phần bằng dòng `---`. Nguồn đọc thêm có dạng `Tên nguồn | https://địa-chỉ`.

Lưu, xem trước rồi xuất ZIP. Bộ dựng dùng chung giữa Node.js và trình duyệt tạo HTML mới, cập nhật chuyên mục, sitemap và feed. Đổi mã bài sẽ đổi đường dẫn; nếu đã chia sẻ đường dẫn cũ, cân nhắc chuyển hướng ở hosting.

Tab Bài từ Facebook cho phép thêm liên kết thật. Khu này không xuất hiện ở trang chủ khi danh sách trống. Chỉ liên kết HTTPS đúng miền Facebook được chấp nhận; không có iframe, Facebook SDK hoặc video mẫu giả làm nội dung thật.

## Bản nháp và dữ liệu cá nhân

Bàn biên tập là công cụ cục bộ, không phải quản trị có đăng nhập. Nó không cho người khác sửa website trên máy chủ. Bản nháp ở trong trình duyệt cho tới khi bạn xuất và triển khai lại.

`site-data.js` chứa nội dung công khai: không nhập mật khẩu, khóa API hoặc thông tin bí mật. Tệp JSON sao lưu thư viện có thể chứa ghi chú riêng; giữ tệp ở nơi riêng tư. Website không tự đồng bộ dữ liệu đọc giữa thiết bị và không tự gửi email hoặc tin nhắn.

localStorage có thể bị chặn, đầy hoặc mất khi xóa dữ liệu trình duyệt. Nếu mở bằng `file:` và việc lưu không nhất quán, dùng `npm start`. Các tài nguyên xuất vẫn tự chứa trong gói. Prompt nháp, dấu chọn Studio, kịch bản chọn lưu, kế hoạch nội dung và tùy chọn hiển thị cũng được lưu cục bộ. Lịch sử biên tập không được tự đưa vào tệp dữ liệu công khai.

Bản nháp phiên bản 1 được giữ thay đổi đã có và bổ sung nội dung khởi đầu mới khi bàn biên tập phiên bản 2 mở lại. Hãy xuất JSON trước khi nâng cấp hoặc chỉnh sửa tiếp nếu muốn giữ một bản độc lập.

## Dựng và kiểm tra

Không cần `npm install`.

```bash
node scripts/build.mjs
npm test
python3 scripts/check-pages.py
```

`scripts/check-export.mjs` mô phỏng xuất website bằng chính bộ dựng và bộ ghi ZIP dùng ở bàn biên tập. Chương trình nhận đường dẫn ZIP tạm, thêm một bài kiểm tra rồi xuất để kiểm tra độc lập. Không dùng tệp kiểm tra này làm website chính thức.

Bản 6 đã đạt 42 kiểm thử Node; 35 HTML của bản giao được kiểm tra tài nguyên, đường dẫn, mục lục, JSON-LD và SVG. ZIP mô phỏng thêm bài mới đã giải nén và kiểm tra độc lập thành công. Chưa kiểm tra trực quan hoặc thao tác thực tế bằng trình duyệt vì môi trường không có công cụ browser QA được hỗ trợ.

## Triển khai

Tải nội dung `dist/` lên hosting web tĩnh, hoặc dùng thư mục website xuất từ bàn biên tập. Liên kết tương đối hỗ trợ triển khai trong thư mục con. Trong `RPGVN/wedsite-github`, mã này nằm ở `tech-horizon/`.

GitHub Pages: chọn đúng nguồn xuất bản theo https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages. Quyền truy cập bản Sites do chủ kênh quản lý; bản hiện tại là công khai. Gói ZIP trên máy hoạt động độc lập với thiết lập chia sẻ này.

## Nội dung, hình ảnh và nguồn

Cẩm nang là nội dung khởi đầu biên soạn cho website, không phải bài tự lấy từ Facebook. Không bịa lượt theo dõi, lượt xem, khách hàng hoặc đánh giá. Lộ trình là gợi ý đọc, không phải chứng chỉ hoặc khóa học được cấp phép.

Nguồn được liên kết từng bài/thuật ngữ: NIST, Microsoft, CISA/US-CERT, MDN, Cloudflare, Kingston, Crucial và GitHub Docs. Hướng dẫn vận hành cụ thể có thể cần đối chiếu theo phiên bản phần mềm hoặc thiết bị.

Biểu trưng TH và 8 SVG được xây dựng cho website. Ảnh `dist/assets/horizon-globe.webp` tạo bằng imagegen tích hợp, tối ưu WebP. Prompt: “A sophisticated cinematic 3D technology illustration, a luminous cyan glass and machined silver globe with fine illuminated latitude and longitude lines and orbital rings, floating over a dark navy microchip platform; globe on right, dark negative space on left; restrained cyan, indigo and small warm yellow accents; no text, logos or UI.” Không đưa ảnh chụp màn hình quản lý Facebook của người dùng vào bản xuất.

## Cấu trúc chính

`dist/site-data.js` giữ nội dung. `assets/renderer.js` dựng trang dùng chung; `core.js` xử lý tìm kiếm và dữ liệu; `app.js` giữ tương tác nền; `premium.js` bổ sung góc đọc, thư viện và từ điển; `editor.js` là bàn biên tập; `zip.js` ghi ZIP theo chuẩn. `style.css`, `premium.css`, `studio.css` và `creator.css` giữ thiết kế. `workbench.js` xử lý các công cụ bằng hàm dùng chung để kiểm tra; `studio.js` nối giao diện và tìm kiếm tổng hợp; `studio-markup.js` dựng giao diện Studio.

`assets/package-assets.js` giữ tài nguyên xuất ZIP, chỉ tải trong bàn biên tập. Bộ tài nguyên không chứa bản sao chính nó; khi xuất, công cụ thêm tệp này trở lại để website tải về vẫn sửa và xuất tiếp được. Sau khi sửa mã nguồn, chạy `node scripts/build.mjs` để cập nhật bộ tài nguyên.

`creator-core.js` chứa mô hình kế hoạch, ICS/CSV, tính toán ảnh/kịch bản và sao lưu; `creator-markup.js` dựng các trang mới; `creator.js` nối dữ liệu/giao diện; `media-tools.js` dùng Canvas để chuẩn bị ảnh. Nguồn kỹ thuật: https://www.rfc-editor.org/rfc/rfc5545.html và https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob.

## Chạy từ mã nguồn GitHub

Kho mã giữ các tệp nguồn riêng lẻ. Gói lớn `dist/assets/package-assets.js` được dựng tự động khi chạy `npm start`; không cần `npm install`. Có thể chạy `node scripts/build.mjs` rồi mở `index.html`. ZIP bàn giao đã có gói tài nguyên và mở trực tiếp được.

## Tài nguyên trải nghiệm mới

`experience-core.js` giữ gợi ý đọc và tình huống khám phá; `experience-markup.js` dựng khối trang chủ; `experience.js` nối tương tác; `experience.css` giữ hệ thống hình ảnh và chuyển động. Hero tạo qua Runway, từ mô tả vòng titanium/kính trên nền xanh đêm, ánh sáng cyan và một điểm nhấn coral, không chữ hoặc logo. Minh họa AI nhỏ tạo qua Canva: khối kính chứa nút mạng thần kinh bạc cùng một quả cầu kim loại. Canva: https://www.canva.com/M/MAHYa3kWeWw?utm_source=OC-AaBlKrqBJJNF&utm_campaign=agent_connector_create_image_asset_opened .
