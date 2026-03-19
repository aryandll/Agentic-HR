package com.hr.system.backend.dto;

public class CopilotResponse {
    private String reply;

    public CopilotResponse(String reply) {
        this.reply = reply;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }
}
