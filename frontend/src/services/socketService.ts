// services/socketService.ts
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import api from "../config/api.config";

type NotificationCallback = (data: any) => void;

class SocketService {
  private static instance: SocketService;
  private client: Client;
  private notificationCallback?: NotificationCallback;
  private isConnectedState: boolean = false;

  private constructor() {
    this.client = new Client({
      // URL kết nối tới endpoint "/ws" đã định nghĩa trong WebSocketConfig.java
      // Nếu dùng SockJS, ta dùng webSocketFactory thay vì brokerURL
      webSocketFactory: () =>
        new SockJS(
          process.env.REACT_APP_SOCKET_API || "http://localhost:8080/ws",
        ),

      // Cấu hình debug để xem log
      debug: (str) => {
        console.log("STOMP: " + str);
      },

      // Tự động kết nối lại sau 5s nếu mất kết nối
      reconnectDelay: 5000,

      // Heartbeat: gửi tín hiệu mỗi 4s để giữ kết nối
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      this.isConnectedState = true;
      console.log("✅ Connected to WebSocket STOMP");

      // Ví dụ: Subscribe vào topic chung hoặc topic riêng của user
      // Backend config: config.enableSimpleBroker("/topic", "/queue");

      // 1. Subscribe nhận thông báo chung
      this.client.subscribe("/topic/notifications", (message: IMessage) => {
        this.handleNotification(message);
      });

      // 2. Nếu muốn subscribe riêng cho user (cần backend hỗ trợ /user/queue/...)
      // this.client.subscribe(`/user/queue/notifications`, ...);
    };

    this.client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    this.client.onWebSocketClose = () => {
      this.isConnectedState = false;
      console.log("🔴 Disconnected from WebSocket");
    };
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(userId: string): void {
    // userId có thể dùng để gửi header xác thực nếu cần
    this.client.connectHeaders = {
      "user-id": userId,
    };

    if (!this.client.active) {
      this.client.activate();
    }
  }

  public disconnect(): void {
    if (this.client.active) {
      this.client.deactivate();
      this.isConnectedState = false;
    }
  }

  // Xử lý message nhận được
  private handleNotification(message: IMessage) {
    if (message.body) {
      const data = JSON.parse(message.body);
      console.log("📩 Received notification:", data);
      if (this.notificationCallback) {
        this.notificationCallback(data);
      }
    }
  }

  public onNotification(callback: NotificationCallback): void {
    this.notificationCallback = callback;
  }

  /**
   * Gửi một message tới backend thông qua HTTP API để broadcast qua WebSocket.
   * @param body Nội dung của message.
   */
  public send(body: SocketMessage): void {
    api.post("/websocket/send-message", body);
  }

  public get isConnected(): boolean {
    return this.isConnectedState;
  }
}

export default SocketService.getInstance();

export interface SocketMessage {
  type: string;
  recieve: string[];
}
