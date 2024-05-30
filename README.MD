# nodejs
- node server.js

# rabbitMQ
- http://localhost:15672/ 
- guest/guest

Hello world: 
- `node .\helloworld.js` 

- new_task.js : Lập lịch các tác vụ cho hàng đợi.
- worker.js : Worker sẽ nhận và thực hiện các tác vụ.

Open 3 terminals:
- terminal 1 :  
  - `node .\worker.js`
- 2 :  
  - `node .\worker.js`
- 3 : <chạy 1 lúc>
  - `node new_task.js First message.`
  - `node new_task.js Second message..`
  - `node new_task.js Third message...`
  - `node new_task.js Fourth message....`
  - `node new_task.js Fifth message.....`



Mục đích test:
- Round-Robin Dispatching: 
  - Tình huống thực tế: có hai worker và bạn gửi nhiều thông điệp đến hàng đợi. RabbitMQ sẽ luân phiên gửi từng thông điệp cho từng worker, phân phối đều công việc
  - Ví dụ:
    Giả sử bạn có hai worker và gửi 5 thông điệp. Worker 1 sẽ nhận các thông điệp 1, 3, 5 và Worker 2 sẽ nhận các thông điệp 2, 4.