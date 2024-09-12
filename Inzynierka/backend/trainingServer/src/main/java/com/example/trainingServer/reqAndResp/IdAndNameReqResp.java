package com.example.trainingServer.reqAndResp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class IdAndNameReqResp {
    private String name;
    private long id;
}
