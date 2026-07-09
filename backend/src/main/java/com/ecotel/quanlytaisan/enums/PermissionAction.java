package com.ecotel.quanlytaisan.enums;

import lombok.Getter;

@Getter
public enum PermissionAction {
    C("c"), R("r"), U("u"), D("d"), A("a");

    private final String key;
    PermissionAction(String key) { this.key = key; }
}
