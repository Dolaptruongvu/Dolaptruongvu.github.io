Cách sử dụng git : 
- Đầu tiên phải sử dụng git remote resposistories  ( remote đến link của chủ project )
- Sau đó cần clone về ( clone nhánh main-project )

Cách push lên git :
- git checkout dev-project ( để chắc chắn rằng đang ở nhánh dev chứ không phải main để tránh việc push nhầm vào main )
- Sau khi code xong thì dùng lệnh git add . ( có nghĩa là add toàn bộ folder hay file trong thư mục hiện tại )
- Sau đó dùng git commit -m " < tên lịch sử commit > " , VD : hôm nay làm responsive cho màn hình 1920x1080 thì tên lịch sử là final for responsive 1920 x 1080 , không được đặt tên lung tung mà đặt đúng mục đích push
- Sau đó dùng lệnh git push origin dev-project ( để push vào nhánh dev )

