package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeFileData extends Domain {
    private String fileId;
    private String fileName;
    private String fileDesc;
    private byte[] fileContent;
    private String uploadDate;
    private String fileExtention;
    private String fileSize;
    private int bf_pk;
    private int userNo;
    private String regDatetime;
    private String modDatetime;
    private String attrib;
}
