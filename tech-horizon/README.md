# Tech Horizon 9.0

Website tiếng Việt của kênh Tech Horizon, dựa trên tên và thông điệp chủ kênh cung cấp. HTML/CSS/JavaScript chạy cục bộ hoặc trên hosting tĩnh; không cần cài thư viện hay khóa API.

## Nâng cấp 9.0

- Bản đồ khám phá có bốn ảnh chuyên mục đồng bộ (tổng 63.762 byte), giữ hình quỹ đạo và nhận diện TH. Trang chuyên mục có ảnh, số cẩm nang/thuật ngữ thực tế và một điểm bắt đầu từ bài đang có. Chuyên mục tự thêm dùng ảnh dự phòng.
- Cẩm nang có chế độ Thẻ hoặc Danh sách; lựa chọn đi cùng bộ lọc trên URL. Mọi bài vẫn có HTML riêng để đọc khi JavaScript tắt.
- Tìm kiếm tổng hợp tìm cả nội dung chính của cẩm nang, hiển thị đoạn liên quan và tô sáng từ khóa có/không dấu. Kết quả chia nhóm; dùng phím mũi tên, Home/End và Esc. Tô sáng vẫn xử lý nội dung nhập như văn bản. Tìm kiếm này chỉ lập chỉ mục nội dung công khai, không tìm trong ghi chú cá nhân.
- Nguồn cuối bài có tên miền, liên kết gốc và lối tắt từ thanh công cụ đọc. Có tải bản đọc TXT gồm nội dung và nguồn của bài; ghi chú riêng vẫn xuất ở Thư viện. Website không tự xác minh tính chính xác hoặc tình trạng truy cập của nguồn.
- Bàn biên tập có biểu mẫu tạo/sửa/xóa lộ trình và thuật ngữ. Chọn, đổi thứ tự bài trong lộ trình; thuật ngữ có định nghĩa và nguồn HTTPS. Mã trùng và liên kết bài không tồn tại bị chặn. Lưu bản nháp, xem trước và ZIP dùng cùng nội dung; phần đang nhập được đưa vào tệp phục hồi nếu lưu bị chặn.
- Khôi phục cả thiết bị giữ ảnh chụp dữ liệu tại lúc xem tệp; nếu dữ liệu trong nhóm được chọn đã đổi, trang yêu cầu xem lại. Xóa nhóm cũng kiểm tra trước khi ghi. Khi lỗi, chỉ hoàn lại phần vẫn thuộc lần ghi đó, giữ thay đổi mới từ tab khác. Sáu nhóm sao lưu và bản sao cũ được giữ tương thích.

## Mở và chạy

1. Giải nén toàn bộ thư mục Tech_Horizon.
2. Mở `index.html` ở thư mục gốc, hoặc nhấp đúp `MO_WEBSITE.bat` trên Windows.
3. Website chạy trong `dist/`. Giữ nguyên cấu trúc thư mục để các bài, ảnh và bàn biên tập mở đúng.

Nếu có Node.js 20.11 trở lên, chạy `npm start`, mở `http://localhost:8080` rồi dừng bằng Ctrl + C. Máy chủ chỉ lắng nghe trên máy cục bộ. Chạy bằng HTTPS hoặc máy chủ cục bộ sẽ ổn định hơn `file:` đối với lưu dữ liệu, sao chép và giọng đọc.

## Trải nghiệm người đọc

- Trang chủ theo phong cách tạp chí công nghệ, giữ hình quỹ đạo và tông navy/cyan/coral của kênh. Bố cục có gợi ý đọc, điểm biên tập, chuyên mục, thực hành, lộ trình và thuật ngữ. Các phần Studio và điểm biên tập được làm gọn để tránh lặp nhiều thẻ giống nhau.
- **Bạn có 5 phút?** cho chọn chủ đề ngay trước phần ảnh trên điện thoại. Có thể tiếp tục bài đang đọc phù hợp trên thiết bị. Khi chưa có bài dưới 5 phút, thời gian thật của bài ngắn nhất được ghi rõ.
- **Khám phá theo nhu cầu** chọn chủ đề, mục tiêu và thời gian. Ba mục tiêu: Hiểu từ đầu, Thử làm ngay, Tránh nhầm lẫn. Có một bài nên đọc trước, hai lựa chọn tiếp theo, trạng thái trống có cách mở rộng thời gian và nút chia sẻ bộ lọc.
- **Cẩm nang** (`dist/tat-ca.html`) liệt kê đủ 16 bài, tìm tiếng Việt có/không dấu, lọc chuyên mục và sắp xếp. Bộ lọc xuất hiện trên URL để có thể mở lại. Bài đã lưu nằm trong Thư viện cá nhân.
- **Góc đọc** gồm mục lục, cỡ chữ, chế độ tập trung, tiến độ, ghi chú, chia sẻ, in/PDF và các thuật ngữ liên quan. Giọng đọc dùng speechSynthesis của thiết bị; cần có giọng tiếng Việt. Website thông báo nếu giọng đọc chưa có. Ghi chú có tải TXT; khi tab khác thay đổi ghi chú đang sửa, trang giữ phần đang nhập và chặn ghi đè để bạn tải về trước khi tải lại.
- Giữ 4 chuyên mục, 4 lộ trình, 20 thuật ngữ có nguồn. Tiến độ lộ trình dựa vào bài đã đọc trên trình duyệt này.
- **Giải mã nhanh** có ba tình huống tương tác, lời giải và liên kết tới cẩm nang. Đây là hoạt động tự tìm hiểu trong lượt mở trang.

## Thư viện cá nhân 8.0

`dist/thu-vien.html` là góc đọc riêng: năm nhóm Đã lưu, Đang đọc, Đã đọc, Ghi chú và Tất cả. Có thẻ tiếp tục bài vừa đọc dở, tìm kiếm tiếng Việt cả trong ghi chú, lọc chuyên mục và sắp xếp theo tương tác, tiêu đề, bài ngắn hoặc ít phút còn lại. Thời gian còn lại là ước lượng theo số phút của bài và tiến độ, không đo tốc độ đọc thật.

Ghi chú giữ xuống dòng, có tải TXT từng bài hoặc các ghi chú trong danh sách đang lọc. Từ khóa ghi chú không được thêm vào URL. JSON sao lưu vẫn chứa toàn bộ thư viện dù bạn đang dùng bộ lọc.

Lưu/bỏ lưu đọc lại danh sách hiện tại trước khi ghi để tránh thay cả danh sách bằng trạng thái cũ của tab. Khi khôi phục hoặc xóa, trang kiểm tra dữ liệu có thay đổi kể từ lúc mở hộp xác nhận. Khôi phục hai nhóm bài lưu/tiến độ có hoàn lại phần đã ghi nếu lưu tiếp bị lỗi; không hoàn lại đè lên thay đổi mới do tab khác vừa tạo. Đây là kiểm tra phía trình duyệt, không phải cơ chế đồng bộ máy chủ.

## Trạm thực hành

Mở `dist/thuc-hanh.html`. Bốn nhiệm vụ nối bài đọc với công cụ: prompt rõ ràng, nội dung có nguồn, ảnh gọn dễ đọc và thời gian tải tệp.

Mỗi phiếu có cẩm nang, hướng dẫn thử, ba mục tự đối chiếu và ô ghi chép. Phiếu **tự lưu trên trình duyệt** sau khi nhập, có trạng thái lưu, tải TXT và xóa riêng từng phiếu. Dấu chọn là tự đánh giá của bạn. Các bài đọc và Studio mở ở tab mới để bạn giữ phiếu thuận tiện.

Phiếu được đưa vào nhóm **Phiếu & ghi chép thực hành** trong trung tâm Dữ liệu & hiển thị. Nếu dữ liệu thay đổi ở tab khác, trang giữ phần đang nhập và yêu cầu đọc lại bản đã lưu; bạn có thể tải TXT trước. Khi bộ nhớ bị chặn, đầy hoặc dữ liệu hỏng, trạng thái nói rõ và không báo đã lưu thành công.

## Sáu công cụ Studio

Mở `dist/studio.html`. Công cụ hoạt động trên dữ liệu bạn nhập, không yêu cầu dịch vụ ngoài.

| Công cụ | Cách hoạt động |
| --- | --- |
| Xây prompt rõ ràng | Ghép mẫu có ngữ cảnh, người đọc, định dạng và bước kiểm chứng; bạn mang sang công cụ AI mình dùng. |
| Tính thời gian tải tệp | Đổi Mbps/MB/s, phân biệt GB/GiB, ước lượng theo tốc độ và hệ số bạn nhập; không đo mạng thật. |
| Tạo liên kết chiến dịch | Tạo URL HTTPS có UTM; không tự bật thống kê, mở hoặc gửi URL. |
| Rà soát trước khi đăng | 12 mục tự đối chiếu về nội dung, nguồn, hình và dữ liệu cá nhân; có tải TXT. |
| Chuẩn bị ảnh | Cắt giữa khung, đổi kích thước và xuất PNG/JPEG/WebP. Tối đa 15 MB/40 MP đầu vào, chiều rộng xuất 64–2048 px. |
| Thời lượng kịch bản | Đếm cụm ngăn bằng khoảng trắng, ký tự Unicode và ước tính thời lượng theo tốc độ chọn; có lưu nháp/TXT. |

Ảnh xử lý ngay trên thiết bị. PNG/WebP giữ trong suốt, JPEG dùng nền trắng. Phóng ảnh nhỏ không tạo thêm chi tiết thật. Thời lượng kịch bản cần được bạn đọc thử để chốt.

## Biên tập và gắn Facebook

Ảnh tham khảo không có URL Facebook chính thức. Website chưa gắn một trang được đoán theo tên. Thêm đúng URL trong `dist/bien-tap.html` → Thông tin kênh; email công khai là tùy chọn.

Bàn biên tập cho đổi tên, mô tả, màu, logo, ảnh bìa và ảnh từng bài. Tệp ảnh PNG/JPEG/WebP: logo tối đa 150 KB, ảnh bìa 400 KB, mỗi ảnh bài 250 KB. Mô tả ảnh giúp người dùng trình đọc màn hình hiểu ảnh riêng.

Thêm/sửa/nhân bản/xóa cẩm nang; mỗi phần gồm tiêu đề và nội dung, ngăn hai phần bằng dòng `---`. Nguồn có dạng `Tên nguồn | https://địa-chỉ`. Đổi mã bài làm đổi URL; cân nhắc chuyển hướng nếu đường cũ đã được chia sẻ.

Mục **Thay đổi & xuất bản** đối chiếu bản nháp đã lưu với tệp `site-data.js` đang mở: bài thêm, bài sửa và các trường thay đổi, URL bài bỏ, thông tin kênh và các bộ nội dung. Có tải bảng TXT và mở bài cần sửa. Nút Lưu các biểu mẫu & cập nhật giữ các thay đổi đang nhập trước khi đối chiếu. Bảng không truy cập hosting để xác minh bản online; đổi/xóa mã bài cần bạn xem lại đường dẫn cũ.

Bảng rà soát kiểm tra nguồn còn thiếu, tóm tắt, mục lục lặp, đoạn dài và mô tả ảnh. Đây là kiểm tra cấu trúc của bản nháp đã lưu. Chủ kênh vẫn cần mở nguồn và đối chiếu các khẳng định.

Bản nháp giữ tối đa ba trạng thái trước đó khi còn chỗ. Khi một tab khác đã lưu bản mới hoặc bộ nhớ không đọc được, bàn biên tập chặn ghi đè. Nút tải tệp phục hồi giữ dữ liệu đang nhập, kể cả biểu mẫu chưa lưu. Tệp này dùng để giữ nội dung phục hồi thủ công, không nhập trực tiếp như JSON sao lưu chuẩn.

Tab Bài từ Facebook nhận liên kết thật tới bài/Reels và mô tả; tối đa 30 mục. Khu này ẩn nếu trống. Website không tự lấy bài, video hoặc chỉ số Facebook và không dùng iframe/SDK của Facebook.

## Kế hoạch nội dung

`dist/dieu-hanh.html` có bảng 5 trạng thái, lịch tháng, lọc, tìm, sửa, nhân bản và xóa, tối đa 300 kế hoạch. Ngày giờ dùng Việt Nam UTC+7. Bản nháp có dàn ý, nguồn, định dạng và liên kết bài đã đăng.

ICS tạo sự kiện 30 phút để bạn nhập vào ứng dụng lịch. CSV giữ tiếng Việt và tránh thực thi công thức từ nội dung. Không tự đăng Facebook, gửi lời mời hoặc nhắc khi website đóng. Trang kiểm tra thay đổi giữa các tab trước khi lưu.

## Dữ liệu, hiển thị và liên hệ

`dist/du-lieu.html` sao lưu/khôi phục **6 nhóm**: bản nháp/lịch sử, thư viện/ghi chú, Studio, kế hoạch, phiếu thực hành và hiển thị. Có xem tệp trước, kiểm tra định dạng, chọn nhóm, hoàn lại khi lưu lỗi và tải dữ liệu thô để giữ bản phục hồi. Bản sao cũ không có nhóm phiếu vẫn dùng được; không thay dữ liệu ngoài nhóm được chọn.

Cỡ giao diện có ba mức, tùy chọn tăng tương phản và giảm chuyển động; áp dụng cả bàn biên tập. Trình duyệt có thể chặn, xóa hoặc làm đầy bộ nhớ. Dữ liệu không tự đồng bộ qua thiết bị. Hãy tải sao lưu trước khi đổi máy hoặc xóa dữ liệu.

`dist/gioi-thieu.html` có hồ sơ kênh với số lượng nội dung thật, tải TXT và soạn đề xuất hợp tác. Biểu mẫu chỉ soạn nội dung để bạn tự gửi qua email hoặc kênh chính thức; không có gửi tin trên máy chủ. `dist/huong-dan.html` có hướng dẫn vận hành ngay trong website.

## Xuất và cập nhật online

1. Lưu bản nháp, xem Thay đổi & xuất bản và kiểm tra bằng Xem trước.
2. Điền đúng địa chỉ HTTPS của website trước khi xuất để canonical, sitemap, RSS và chia sẻ trỏ đúng nơi.
3. Nhấn **Xuất toàn bộ website ZIP**, giải nén và mở `index.html` trong thư mục website vừa xuất.
4. Tải toàn bộ nội dung website trong ZIP lên hosting tĩnh để cập nhật online. Tải ZIP xuống không tự thay bản đang chạy.

Gói xuất có HTML từng bài/chuyên mục, ảnh, Studio, bàn biên tập và tài nguyên để xuất lại. Không chỉ gửi riêng `index.html`. Metadata, Open Graph, JSON-LD, sitemap, RSS, quyền riêng tư và 404 được dựng theo dữ liệu hiện tại.

Bộ dựng và xuất `site-data.js` chỉ lấy các trường nội dung được hỗ trợ. Các trường bổ sung từ tệp nhập được giữ trong JSON sao lưu nháp nhưng không đưa vào gói website. Nội dung bạn viết trong các trường cẩm nang hoặc thông tin kênh vẫn công khai.

ZIP website là **nội dung công khai**. Sao lưu thiết bị, phiếu TXT và tệp phục hồi biểu mẫu có thể chứa ghi chú hoặc kế hoạch riêng; không tải chúng lên thư mục web. Không đặt mật khẩu, mã OTP hoặc khóa API trong `site-data.js`.

## Kiến trúc và kiểm tra

Mã nguồn chính nằm ở `dist/assets/`, dữ liệu công khai ở `dist/site-data.js`. `renderer.js` dựng cùng một bộ trang trong Node và khi xuất ZIP trên trình duyệt. `scripts/build.mjs` dựng trang, tuyến bài và bundle base64 chỉ dùng trong bàn biên tập. Bundle sinh tự động không đưa vào Git; build/start/test sẽ tạo lại.

Mã quản lý và xử lý ảnh chỉ tải trên trang cần dùng. Trang chủ tải ít mã JavaScript hơn nhờ tách phần quản lý; đây là giảm tài nguyên tĩnh, không phải kết quả đo thời gian tải thực tế. Giao diện giữ ảnh quỹ đạo đã có và thêm ảnh bàn thực hành khoảng 21 KB.

Không cần `npm install`:

```bash
npm run build
npm test
python3 scripts/check-pages.py
node scripts/check-export.mjs ./website-kiem-tra.zip
```

85 kiểm thử Node đã đạt, gồm mô phỏng bộ điều khiển thư viện trong VM, bộ lọc ghi chú, phục hồi lỗi bộ nhớ và dữ liệu thay đổi giữa các tab. 35 HTML được kiểm tra tài nguyên, liên kết, neo, nhãn điều khiển, JSON-LD và SVG. ZIP kiểm tra xuất thêm một bài giả chỉ phục vụ QA, không dùng để xuất bản website chính thức. Chưa kiểm chứng trực quan hoặc thao tác thực tế trên trình duyệt vì môi trường hiện tại thiếu công cụ browser QA được hỗ trợ.

Nguồn trong GitHub nằm ở `tech-horizon/`. Giữ bộ dựng dùng chung và thêm mọi phụ thuộc xuất vào trang biên tập/bundle nếu mở rộng tiếp. Bản này chưa có máy chủ đăng nhập, đồng bộ dữ liệu chung hoặc tự đăng Facebook.
