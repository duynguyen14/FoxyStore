package com.example.back.enums;

import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public enum ActionUser {
    VIEW("view", 1.0f),
    ADD_TO_CART("add_to_cart", 3.0f),
    PURCHASE("purchase", 5.0f),
    WRITE_REVIEW("write review", 2.5f),
    ADD_TO_WISHLIST("add_to_wishlist", 3.5f)
    ;
    private final String action;
    private final Float score;

    ActionUser(String action, Float score) {
        this.action = action;
        this.score = score;
    }

    private static final Map<String, ActionUser> LABEL_TO_ENUM;

    static {
        LABEL_TO_ENUM = new HashMap<>();
        for (ActionUser a : values()) {
            LABEL_TO_ENUM.put(a.action.toLowerCase(), a);
        }
    }

    public static ActionUser getByAction(String action)  {
        return LABEL_TO_ENUM.get(action.toLowerCase());
    }
}
