/* Chỉnh sửa nhanh trong bien-tap.html, sau đó xuất và thay thế tệp này. */
window.TECH_HORIZON = {
  config: {
    name: 'Tech Horizon',
    tagline: 'Nơi công nghệ không còn khó khăn.',
    description: 'Cùng Tech Horizon bắt kịp công nghệ bằng góc nhìn dễ hiểu nhất. Khám phá AI, thủ thuật hữu ích, thiết bị và những thói quen an toàn trong thế giới số.',
    facebookUrl: '',
    email: '',
    siteUrl: 'https://tech-horizon-vn.benho26032005.chatgpt.site',
    accent: '#69d5ff',
    contentNote: 'Bộ cẩm nang khởi đầu được biên soạn cho website. Nội dung này không phải bản sao các bài đăng trên Facebook.'
  },
  categories: [
    {id:'ai', name:'AI & xu hướng', short:'AI', icon:'spark', description:'Hiểu AI, ứng dụng đúng và làm chủ công cụ mới.'},
    {id:'tips', name:'Thủ thuật hữu ích', short:'Thủ thuật', icon:'command', description:'Những thao tác nhỏ, giúp một ngày nhẹ nhàng hơn.'},
    {id:'devices', name:'Thiết bị & kết nối', short:'Thiết bị', icon:'chip', description:'Hiểu máy tính và mạng để sử dụng hiệu quả hơn.'},
    {id:'safety', name:'An toàn số', short:'An toàn số', icon:'shield', description:'Bảo vệ tài khoản, dữ liệu và sự riêng tư của bạn.'}
  ],
  articles: [
    {id:'bat-dau-voi-ai', title:'Bắt đầu với AI: hỏi đúng, dùng hiệu quả hơn', category:'ai', date:'2026-10-19', minutes:5, image:'ai', featured:true,
     excerpt:'Không cần những câu lệnh phức tạp. Một chút ngữ cảnh và một mục tiêu rõ ràng là khởi đầu tốt để làm việc cùng AI.',
     takeaway:'Một yêu cầu tốt nói rõ việc cần làm, ngữ cảnh và hình thức đầu ra. Kết quả vẫn cần được kiểm tra.',
     sections:[
       {heading:'Bắt đầu từ việc bạn thật sự cần',text:'Thay vì hỏi một câu quá rộng, hãy chọn một nhiệm vụ nhỏ: rút gọn một đoạn văn, lên dàn ý hoặc giải thích một thuật ngữ. Khi mục tiêu cụ thể, bạn cũng dễ đánh giá câu trả lời có giúp ích hay không.'},
       {heading:'Thử một khung yêu cầu đơn giản',text:'Bạn có thể dùng khung: Tôi đang làm [công việc], dành cho [người đọc]. Hãy giúp tôi [nhiệm vụ], trình bày dưới dạng [định dạng], trong phạm vi [giới hạn]. Ví dụ: Tôi viết bài công nghệ cho người mới. Hãy giải thích DNS bằng một ví dụ đời thường, dưới 150 từ, và nêu một điểm dễ hiểu nhầm.'},
       {heading:'Trao đổi từng vòng',text:'Đọc bản đầu rồi phản hồi bằng một thay đổi cụ thể: rút ngắn phần mở đầu, thêm một ví dụ hoặc chỉ ra điều chưa rõ. Đây là gợi ý cách làm việc, không phải công thức bảo đảm mọi hệ thống AI đều trả lời đúng.'},
       {heading:'Giữ bước kiểm chứng',text:'AI tạo sinh có thể đưa ra thông tin sai nhưng diễn đạt rất tự tin. Với một con số, trích dẫn hay hướng dẫn quan trọng, mở tài liệu gốc và đối chiếu trước khi sử dụng. Không đưa mật khẩu, mã OTP hoặc dữ liệu cá nhân không cần thiết vào lời nhắc.'}
     ], sources:[{label:'NIST — Hồ sơ rủi ro AI tạo sinh',url:'https://www.nist.gov/itl/ai-risk-management-framework'}]},
    {id:'ram-va-bo-nho-luu-tru', title:'RAM và bộ nhớ lưu trữ: hai thứ rất dễ nhầm', category:'devices', date:'2026-10-19', minutes:4, image:'chip',
     excerpt:'Một bên là mặt bàn làm việc, một bên là tủ hồ sơ. Hiểu đúng để đọc thông số máy tính tự tin hơn.',
     takeaway:'RAM phục vụ công việc đang chạy; SSD hoặc ổ cứng lưu tệp lâu dài. Dung lượng của chúng không thay thế cho nhau.',
     sections:[
       {heading:'RAM giống mặt bàn đang làm việc',text:'Khi mở một chương trình, máy tính dùng RAM để giữ dữ liệu cần truy cập trong lúc xử lý. RAM thông thường là bộ nhớ tạm: nội dung không được giữ lại khi mất điện. Nhiều tác vụ cùng lúc cần nhiều khoảng trống trên mặt bàn hơn.'},
       {heading:'SSD và ổ cứng giống tủ hồ sơ',text:'Hệ điều hành, ứng dụng, ảnh và tài liệu được lưu trên ổ lưu trữ. Dữ liệu đã lưu vẫn tồn tại sau khi tắt máy. Có nhiều dung lượng ổ đĩa hơn không đồng nghĩa máy có thêm RAM để chạy chương trình.'},
       {heading:'Đọc triệu chứng trước khi quyết định',text:'Trong Windows, mở Task Manager để xem mức sử dụng bộ nhớ và ổ đĩa trong đúng lúc máy chậm. Nếu ổ đầy, hãy xem lại tệp và ứng dụng. Nếu tác vụ thường xuyên dùng gần hết RAM, kiểm tra nhu cầu của phần mềm và khả năng nâng cấp của đúng mẫu máy trước khi mua.'},
       {heading:'Đừng mua chỉ theo tên gọi',text:'Chuẩn RAM, khe cắm, dung lượng hỗ trợ và loại kết nối ổ lưu trữ phụ thuộc từng máy. Tra tài liệu nhà sản xuất hoặc nhờ kỹ thuật viên xác nhận. Cẩm nang này giải thích khái niệm, không khẳng định một linh kiện cụ thể sẽ tương thích với máy của bạn.'}
     ],sources:[{label:'Crucial — Vai trò của bộ nhớ máy tính',url:'https://www.crucial.com/articles/about-memory/support-what-does-computer-memory-do'}]},
    {id:'nhan-dien-tin-nhan-gia-mao',title:'Dừng 10 giây trước một tin nhắn đáng ngờ',category:'safety',date:'2026-10-19',minutes:4,image:'shield',
     excerpt:'Một đường link lạ, một yêu cầu gấp, một lời hứa hấp dẫn. Tập thói quen kiểm tra trước khi bấm.',
     takeaway:'Cảm giác gấp gáp là lý do để dừng lại. Xác minh bằng một kênh độc lập thay vì làm theo đường dẫn trong tin nhắn.',
     sections:[
       {heading:'Nhận ra áp lực phải hành động ngay',text:'Tin giả mạo thường muốn bạn bấm vào liên kết, mở tệp hoặc cung cấp thông tin. Nội dung có thể giả danh người quen hay đơn vị quen thuộc. Việc tên và ảnh đại diện trông đúng không đủ để chứng minh người gửi là thật.'},
       {heading:'Tự mở ứng dụng hoặc trang chính thức',text:'Nếu nhận thông báo về tài khoản, tự mở ứng dụng bạn thường dùng thay vì đăng nhập qua liên kết trong tin. Khi người quen nhờ việc bất thường, gọi lại bằng số đã lưu hoặc liên hệ qua một kênh khác mà bạn biết từ trước.'},
       {heading:'Báo cáo rồi xử lý tin nhắn',text:'Dùng chức năng báo cáo lừa đảo của dịch vụ nếu có. Không tiếp tục trao đổi với người gửi đáng ngờ. Không chuyển tiếp đường link như một trò đùa vì người khác vẫn có thể bấm nhầm.'},
       {heading:'Nếu bạn đã nhập thông tin',text:'Truy cập dịch vụ qua kênh chính thức, đổi mật khẩu, kiểm tra phiên đăng nhập và bật xác thực nhiều lớp nếu có. Nếu đã cung cấp thông tin thanh toán, liên hệ ngân hàng qua số chính thức để được hướng dẫn. Hãy lưu lại bằng chứng cần thiết.'}
     ],sources:[{label:'CISA — Nhận diện và báo cáo lừa đảo',url:'https://www.cisa.gov/secure-our-world/recognize-and-report-phishing'}]},
    {id:'don-dung-luong-windows',title:'Dọn dung lượng Windows, bắt đầu từ đúng chỗ',category:'tips',date:'2026-10-19',minutes:4,image:'storage',
     excerpt:'Dùng công cụ có sẵn, đọc kỹ danh sách và chỉ xóa thứ bạn hiểu. Một cách dọn máy có kiểm soát.',
     takeaway:'Xem mục Storage trong Settings. Kiểm tra từng lựa chọn trước khi xóa; đừng tự xóa thư mục hệ thống.',
     sections:[
       {heading:'Xem thứ gì đang chiếm chỗ',text:'Mở Settings, vào System rồi Storage để xem các nhóm dung lượng trên máy. Tên và vị trí mục có thể khác nhẹ tùy phiên bản Windows. Bắt đầu với các tệp cá nhân bạn nhận ra, thay vì xóa ngẫu nhiên một thư mục lớn.'},
       {heading:'Kiểm tra tệp tạm và thùng rác',text:'Công cụ của Windows có thể gợi ý tệp tạm và các mục trong Recycle Bin. Đọc danh sách trước khi xác nhận, đặc biệt khi có Downloads hoặc tệp bạn muốn giữ. Nếu chưa chắc, sao lưu ra vị trí khác trước.'},
       {heading:'Cân nhắc Storage Sense',text:'Storage Sense có thể tự giải phóng chỗ bằng cách dọn các mục không cần thiết. Thiết lập liên quan tới thùng rác, tệp tải xuống hoặc nội dung đám mây cần được đọc kỹ. Không chọn tự động dọn một nhóm dữ liệu chỉ vì muốn nhấn ít nút hơn.'},
       {heading:'Tạo thói quen dọn nhỏ, đều đặn',text:'Đặt tài liệu vào thư mục có tên rõ, gỡ ứng dụng không dùng bằng công cụ của Windows và giữ bản sao tệp quan trọng. Tránh các chương trình hứa hẹn tăng tốc thần kỳ hoặc yêu cầu tắt cơ chế bảo vệ để dọn máy.'}
     ],sources:[{label:'Microsoft — Quản lý dung lượng với Storage Sense',url:'https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/manage-drive-space-with-storage-sense'}]},
    {id:'dns-la-gi',title:'DNS là gì? Hành trình phía sau một địa chỉ web',category:'devices',date:'2026-10-19',minutes:4,image:'network',
     excerpt:'Bạn nhớ tên website. Máy tính cần địa chỉ IP. DNS giúp nối hai điều đó lại với nhau.',
     takeaway:'DNS chuyển tên miền thành địa chỉ mạng để trình duyệt tìm tới tài nguyên. Nó chỉ là một phần của quá trình tải trang.',
     sections:[
       {heading:'Một tên dễ nhớ, một địa chỉ để kết nối',text:'Con người thường gõ tên miền thay vì ghi nhớ địa chỉ IP. DNS là hệ thống giúp chuyển tên miền thành địa chỉ mà máy tính sử dụng. Có thể hình dung nó như việc tra cứu danh bạ, nhưng thực tế thông tin được phân tán qua nhiều máy chủ.'},
       {heading:'Thông tin có thể đã được nhớ sẵn',text:'Trình duyệt, hệ điều hành hoặc bộ phân giải DNS có thể giữ kết quả trong bộ nhớ đệm. Nếu thông tin còn hợp lệ, một số bước tra cứu được bỏ qua. Vì vậy, không phải lần mở website nào cũng đi lại toàn bộ hành trình từ đầu.'},
       {heading:'Có IP chưa có nghĩa trang đã tải xong',text:'Sau khi tìm được địa chỉ, trình duyệt còn phải thiết lập kết nối và nhận nội dung. Tốc độ tải ảnh, mã trang và phản hồi máy chủ cũng ảnh hưởng trải nghiệm. Đổi DNS không tự động giải quyết mọi vấn đề Internet chậm.'},
       {heading:'Một cách kiểm tra dễ bắt đầu',text:'Nếu chỉ một website gặp lỗi, thử một website khác, thiết bị khác hoặc mạng khác để thu hẹp phạm vi. Ghi lại thông báo lỗi nguyên văn. Đây là cách kiểm tra từng bước, không phải kết luận rằng DNS luôn là nguyên nhân.'}
     ],sources:[{label:'Cloudflare Learning Center — DNS',url:'https://www.cloudflare.com/learning/dns/what-is-dns/'}]},
    {id:'mat-khau-va-xac-thuc',title:'Tài khoản an toàn hơn từ ba thói quen nhỏ',category:'safety',date:'2026-10-19',minutes:4,image:'lock',
     excerpt:'Mật khẩu riêng cho từng dịch vụ, một nơi quản lý đáng tin cậy và một lớp xác thực bổ sung.',
     takeaway:'Không dùng lại mật khẩu. Ưu tiên mật khẩu dài, riêng biệt và bật xác thực nhiều lớp khi dịch vụ hỗ trợ.',
     sections:[
       {heading:'Mỗi tài khoản, một mật khẩu riêng',text:'Dùng cùng một mật khẩu ở nhiều nơi khiến sự cố của một dịch vụ có thể ảnh hưởng các tài khoản khác. Tạo mật khẩu dài, khó đoán và riêng biệt, thay vì chỉ thêm một con số vào tên hoặc ngày sinh.'},
       {heading:'Dùng công cụ để giảm việc phải nhớ',text:'Trình quản lý mật khẩu giúp tạo và lưu mật khẩu khác nhau. Bảo vệ chính trình quản lý bằng một mật khẩu chính mạnh, làm theo hướng dẫn khôi phục của nhà cung cấp và giữ thông tin khôi phục ở nơi an toàn.'},
       {heading:'Thêm lớp xác thực',text:'Bật xác thực nhiều lớp nếu dịch vụ hỗ trợ. Chọn phương thức phù hợp theo hướng dẫn chính thức của dịch vụ. Không đọc mã OTP cho người khác và không chấp thuận thông báo đăng nhập do bạn không khởi tạo.'},
       {heading:'Chuẩn bị trước khi đổi điện thoại',text:'Kiểm tra thông tin khôi phục và cách chuyển phương thức xác thực trước khi xóa máy cũ. Nếu có mã dự phòng, cất giữ an toàn theo hướng dẫn dịch vụ. Tránh chụp ảnh mã rồi chia sẻ trong nhóm chat.'}
     ],sources:[{label:'CISA — Secure Our World',url:'https://www.cisa.gov/secure-our-world'},{label:'CISA — Mật khẩu và trình quản lý mật khẩu',url:'https://www.cisa.gov/sites/default/files/2024-09/Secure-Our-World-Passwords-Tip-Sheet.pdf'}]},
    {id:'kiem-chung-cau-tra-loi-ai',title:'AI trả lời rất tự tin. Làm sao biết có đúng?',category:'ai',date:'2026-10-19',minutes:4,image:'ai-check',
     excerpt:'Tách câu trả lời thành những điều có thể đối chiếu. Một quy trình nhỏ giúp bạn tránh tin nhầm.',
     takeaway:'Đừng dùng sự trôi chảy làm thước đo chính xác. Hãy đối chiếu dữ kiện quan trọng với nguồn gốc.',
     sections:[
       {heading:'Khoanh đúng những điều cần xác minh',text:'Đánh dấu tên riêng, ngày tháng, số liệu và các khẳng định quan trọng. Phần nào ảnh hưởng tới quyết định của bạn cần được kiểm tra trước. Một đoạn văn mạch lạc chưa chứng minh nội dung của nó chính xác.'},
       {heading:'Tìm nguồn gốc, đọc đúng ngữ cảnh',text:'Nếu có đường dẫn, mở nó và xem nội dung thật sự hỗ trợ khẳng định nào. Ưu tiên tài liệu chính thức khi kiểm tra tính năng hoặc hướng dẫn kỹ thuật. Chú ý thời điểm tài liệu vì một hướng dẫn từng đúng vẫn có thể đã thay đổi.'},
       {heading:'Yêu cầu phân biệt dữ kiện và suy luận',text:'Có thể đề nghị AI nêu điều đã biết, phần suy luận và phần còn thiếu. Đây là cách làm câu trả lời dễ rà soát hơn; bản thân việc AI liệt kê nguồn hoặc gắn mức tự tin không thay thế bước đọc tài liệu gốc.'},
       {heading:'Lưu lại phần đã kiểm tra',text:'Ghi lại đường dẫn và ngày bạn đối chiếu. Nếu không xác minh được một chi tiết quan trọng, bỏ nó khỏi bản sử dụng hoặc nói rõ điều chưa biết. NIST cũng nhận diện thông tin bịa đặt như một dạng rủi ro của AI tạo sinh.'}
     ],sources:[{label:'NIST — Rủi ro của AI tạo sinh',url:'https://www.nist.gov/itl/ai-risk-management-framework'}]},
    {id:'website-tinh-la-gi',title:'Website tĩnh là gì, và khi nào đủ dùng?',category:'tips',date:'2026-10-19',minutes:4,image:'browser',
     excerpt:'Một website giới thiệu và đọc bài không nhất thiết cần hệ thống phức tạp. Hiểu đúng để chọn cách vận hành.',
     takeaway:'Website tĩnh phục vụ các tệp đã chuẩn bị sẵn. Đăng nhập, dữ liệu chung hoặc gửi biểu mẫu thực sự cần dịch vụ bổ sung.',
     sections:[
       {heading:'Bắt đầu từ những tệp quen thuộc',text:'HTML tạo cấu trúc, CSS quyết định cách hiển thị và JavaScript bổ sung tương tác. Website tĩnh có thể cung cấp những tệp này trực tiếp cho trình duyệt mà không cần dựng nội dung bằng cơ sở dữ liệu ở mỗi lượt truy cập.'},
       {heading:'Tĩnh vẫn có thể tương tác',text:'Tìm kiếm trong danh sách có sẵn, lọc chuyên mục và đổi giao diện có thể diễn ra ngay trên trình duyệt. Lưu bài vào bộ nhớ trình duyệt cũng được, nhưng dữ liệu đó không tự đồng bộ sang thiết bị khác.'},
       {heading:'Biết giới hạn trước khi thêm tính năng',text:'Một trang có ô nhập email chưa có nghĩa hệ thống đã gửi thư. Muốn nhận biểu mẫu tập trung hoặc quản lý tài khoản người đọc, cần triển khai dịch vụ phù hợp và xử lý dữ liệu rõ ràng. Hãy phân biệt giao diện với thao tác đã được thực hiện trên máy chủ.'},
       {heading:'Xuất bản từ một nơi rõ ràng',text:'GitHub Pages là một dịch vụ lưu trữ website tĩnh từ kho mã GitHub. Cách thiết lập cụ thể tùy quyền tài khoản và cấu hình kho mã. Với một trang giới thiệu kênh cùng cẩm nang đọc bài, cách tiếp cận tĩnh là điểm khởi đầu gọn gàng.'}
     ],sources:[{label:'GitHub Docs — GitHub Pages là gì?',url:'https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages'}]}
  ]
};
