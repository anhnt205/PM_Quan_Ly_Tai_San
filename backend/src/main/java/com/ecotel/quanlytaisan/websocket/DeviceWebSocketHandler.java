package com.ecotel.quanlytaisan.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class DeviceWebSocketHandler extends TextWebSocketHandler {

    private final CopyOnWriteArraySet<WebSocketSession> sessions = new CopyOnWriteArraySet<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("Device connected: " + session.getId());

        // Gui message test khi device ket noi
        String testMessage = String.format(
            "{\"type\":\"CONNECTION_TEST\",\"message\":\"Ket noi WebSocket thanh cong!\",\"sessionId\":\"%s\",\"timestamp\":\"%s\"}",
            session.getId(),
            LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        );
        session.sendMessage(new TextMessage(testMessage));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("Nhan message tu device " + session.getId() + ": " + payload);

        // Echo lai message cho client
        String response = String.format(
            "{\"type\":\"ECHO\",\"originalMessage\":\"%s\",\"sessionId\":\"%s\",\"timestamp\":\"%s\"}",
            payload.replace("\"", "\\\""),
            session.getId(),
            LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        );
        session.sendMessage(new TextMessage(response));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("Device disconnected: " + session.getId() + ", status: " + status);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.err.println("Transport error for session " + session.getId() + ": " + exception.getMessage());
        sessions.remove(session);
    }

    /**
     * Gui message den tat ca cac device dang ket noi
     */
    public void broadcastMessage(String message) {
        TextMessage textMessage = new TextMessage(message);
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(textMessage);
                } catch (IOException e) {
                    System.err.println("Error sending message to session " + session.getId() + ": " + e.getMessage());
                }
            }
        }
    }

    /**
     * Lay so luong device dang ket noi
     */
    public int getConnectedDeviceCount() {
        return (int) sessions.stream().filter(WebSocketSession::isOpen).count();
    }

    /**
     * Gui message den mot session cu the
     */
    public void sendMessageToSession(String sessionId, String message) {
        for (WebSocketSession session : sessions) {
            if (session.getId().equals(sessionId) && session.isOpen()) {
                try {
                    session.sendMessage(new TextMessage(message));
                } catch (IOException e) {
                    System.err.println("Error sending message to session " + sessionId + ": " + e.getMessage());
                }
                break;
            }
        }
    }
}
