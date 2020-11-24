package cz.zcu.kiv.wernerv.models;

public class Message {

    private final String title;
    private final String value;

    public Message(String title, String value) {
        this.title = title;
        this.value = value;
    }

    public String getTitle() {
        return title;
    }

    public String getValue() {
        return value;
    }
}
