# Tech Horizon

Website tiếng Việt dành riêng cho kênh Facebook **Tech Horizon**, dựa trên ảnh tham khảo của chủ kênh. Giao diện xanh công nghệ, có hai chế độ sáng/tối và bố cục cho máy tính, máy tính bảng, điện thoại.

## Mở và sử dụng

- Mở `dist/index.html` bằng trình duyệt. Không cần cài thư viện, cơ sở dữ liệu hoặc khóa API.
- Nếu máy có Node.js 20.11 trở lên: chạy `npm start`, mở `http://localhost:8080`. Máy chủ đi kèm chỉ lắng nghe trên máy cục bộ; dừng bằng Ctrl + C.
- Nội dung đăng lên dịch vụ lưu trữ web tĩnh nằm toàn bộ trong `dist/`. Các đường dẫn tương đối hỗ trợ triển khai trong một thư mục con.

## Thiết lập Facebook — thông tin duy nhất còn thiếu từ ảnh

Ảnh không chứa địa chỉ hoặc ID Facebook chính thức. Không có URL giả được tự gán.

1. Mở `dist/bien-tap.html`.
2. Dán link trang Facebook chính thức vào **Thông tin kênh**, bổ sung email công khai nếu muốn.
3. Nhấn **Lưu bản nháp**, rồi **Xem trước bản nháp** để kiểm tra.
4. Nhấn **Tải site-data.js**, thay tệp `dist/site-data.js`.
5. Với tên miền, tên kênh hoặc nội dung thay đổi, chạy `node scripts/build.mjs` để cập nhật HTML, mô tả chia sẻ và sitemap. Tải toàn bộ `dist/` lên nơi lưu trữ.

Nếu chỉ mở tệp HTML và trình duyệt hạn chế localStorage cho `file:`, dùng `npm start` để có hành vi lưu bản nháp nhất quán. Nội dung vẫn đọc được khi mở trực tiếp.

## Các chức năng đã có

- Trang chủ, 4 chuyên mục, 8 bài đọc đầy đủ và trang tất cả cẩm nang.
- Tìm kiếm tiếng Việt có dấu hoặc không dấu; lọc chuyên mục, sắp xếp, xem thêm.
- Lưu/bỏ lưu bài trên trình duyệt, xem riêng bài đã lưu.
- Trang bài viết có mục lục, tóm tắt, nguồn tham khảo, gợi ý bài khác và chia sẻ/sao chép liên kết.
- Giao diện sáng/tối, menu điện thoại, nút về đầu trang, chỉ báo tiến độ đọc.
- Cộng đồng Facebook, liên hệ email tùy chọn và công cụ soạn gợi ý chủ đề. Công cụ không giả vờ gửi tin nhắn hoặc biểu mẫu.
- Bàn biên tập cục bộ để sửa thông tin, thêm/sửa/xóa bài, chọn bài nổi bật, xem trước, xuất dữ liệu và sao lưu/khôi phục JSON.
- Trang quyền riêng tư, nút xóa dữ liệu cục bộ và trang 404.
- Metadata tiếng Việt, Open Graph, favicon, Article/WebSite JSON-LD, robots.txt và sitemap.xml.
- Tệp nội dung được kiểm tra dữ liệu, xử lý văn bản thành plain text và chặn đường dẫn Facebook giả mạo.
- Không tải phông chữ, thư viện, bộ theo dõi hoặc hình ảnh phụ thuộc bên ngoài để hiển thị giao diện.

## Những giới hạn được trình bày rõ

Bộ cẩm nang là nội dung khởi đầu được biên soạn cho website, không phải dữ liệu đã lấy từ Facebook. Không bịa lượt theo dõi, lượt xem hoặc đánh giá của kênh. Website không tự đăng bài, đồng bộ Facebook, gửi email, cung cấp tài khoản người đọc hoặc lưu dữ liệu dùng chung trên máy chủ.

Bàn biên tập là công cụ cục bộ, không phải hệ thống quản trị có đăng nhập. Người truy cập không thể dùng công cụ này để thay đổi bản website trên máy chủ. Đừng đặt mật khẩu hoặc thông tin bí mật trong `site-data.js`. Bản nháp chỉ cập nhật cho chính trình duyệt cho tới khi bạn thay tệp và triển khai lại.

Các bài mới thêm bằng dữ liệu vẫn đọc được qua `doc-bai.html?id=ma-bai`. Chạy lại bước dựng trang để tạo HTML riêng và bổ sung bài vào sitemap. Nếu đổi mã bài cũ, hãy cân nhắc giữ đường dẫn cũ hoặc cấu hình chuyển hướng tại dịch vụ lưu trữ.

## Dựng và kiểm tra

```bash
node scripts/illustrations.mjs
node scripts/build.mjs
npm test
python3 scripts/check-pages.py
```

Bước dựng chỉ dùng thư viện chuẩn Node.js. Tạo lại 8 SVG minh họa là tùy chọn; các tệp đã có sẵn. Dự án không cần `npm install`.

## Đưa lên GitHub Pages hoặc dịch vụ web tĩnh

Nguồn mã nằm trong thư mục `tech-horizon/` khi bàn giao qua kho `RPGVN/wedsite-github`. Để dùng làm website riêng, tải thư mục này hoặc lấy bản ZIP hoàn chỉnh. Dùng nội dung `dist/` làm thư mục công khai của dịch vụ. Không đăng toàn bộ kho cũ nếu bạn chỉ muốn website Tech Horizon.

GitHub Pages: đưa nội dung `dist/` vào thư mục được chọn làm nguồn Pages trong một kho bạn muốn dùng, rồi bật xuất bản trong Settings → Pages theo quyền của tài khoản. Hướng dẫn chính thức: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages.

Khi đổi địa chỉ website, cập nhật `config.siteUrl` bằng bàn biên tập và dựng lại. Bản Sites bàn giao ban đầu là bản riêng tư. Nếu muốn người khác truy cập, cần chọn chế độ công khai tại dịch vụ xuất bản hoặc triển khai lên hosting công khai của bạn.

## Hình ảnh và thương hiệu

Tên kênh và thông điệp được lấy từ ảnh người dùng cung cấp. Biểu trưng TH và 8 minh họa là SVG/CSS được xây dựng cho website; không đưa ảnh chụp màn hình quản lý Facebook hoặc thông tin giao diện tài khoản vào bản xuất.

Ảnh nền `dist/assets/horizon-globe.webp` được tạo bằng công cụ imagegen tích hợp, từ tham khảo tông màu của ảnh, rồi tối ưu WebP. Prompt: “A sophisticated cinematic 3D technology illustration, a luminous cyan glass and machined silver globe with fine illuminated latitude and longitude lines and orbital rings, floating over a dark navy microchip platform; globe on right, dark negative space on left; restrained cyan, indigo and small warm yellow accents; no text, logos or UI.”

Nội dung tham khảo chính: tài liệu NIST về AI tạo sinh; Microsoft về Storage Sense; Cloudflare về DNS; CISA về tài khoản và phishing; Crucial về bộ nhớ; GitHub Docs về Pages. Mỗi cẩm nang có liên kết đọc thêm.

## Sắp xếp mã nguồn

`dist/` là website chạy ngay. `site-data.js` giữ thông tin và bài viết. `assets/style.css` giữ thiết kế; `app.js` xử lý tương tác; `editor.js` là bàn biên tập; `core.js` xử lý lọc, URL, dữ liệu và bộ nhớ. `scripts/build.mjs` tạo HTML/SEO từ dữ liệu; `tests/` kiểm tra hành vi quan trọng.
