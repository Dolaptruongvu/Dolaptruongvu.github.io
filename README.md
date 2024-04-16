Cách sử dụng git : 
- Đầu tiên phải sử dụng git remote resposistories  ( remote đến link của chủ project )
- Sau đó cần clone về ( clone nhánh main-project )
( Trường hợp đã clone về sẵn và đã làm việc )
- Hằng ngày phải check xem đang ở nhánh nào bằng lệnh git branch , nếu như đang ở nhánh dev-project thì không cần chuyển , nếu như ở nhánh main-project thì dùng git checkout dev-project để chuyển nhánh
- Sau đó dùng lệnh git pull để lấy tất cả cập nhật về rồi hẵn code


Cách push lên git :
- git checkout dev-project ( để chắc chắn rằng đang ở nhánh dev chứ không phải main để tránh việc push nhầm vào main )
- Sau khi code xong thì dùng lệnh git add . ( có nghĩa là add toàn bộ folder hay file trong thư mục hiện tại )
- Sau đó dùng git commit -m " < tên lịch sử commit > " , VD : hôm nay làm responsive cho màn hình 1920x1080 thì tên lịch sử là final for responsive 1920 x 1080 , không được đặt tên lung tung mà đặt đúng mục đích push
- Sau đó dùng lệnh git push origin dev-project ( để push vào nhánh dev )


