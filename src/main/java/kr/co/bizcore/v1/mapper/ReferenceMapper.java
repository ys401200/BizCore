package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.NoticeFileData;
import kr.co.bizcore.v1.domain.Reference;
import kr.co.bizcore.v1.domain.SoppFileData;

public interface ReferenceMapper {
    @Select("SELECT * FROM swc_board_file WHERE bf_delflag = 'n'")
    public List<Reference> getReferenceList(@Param("reference") Reference reference);

    @Select("SELECT * FROM swc_board_file WHERE bf_pk = #{bf_pk} AND bf_delflag = 'n'")
    public Reference getReference(@Param("bf_pk") String bf_pk);

    @Insert("INSERT INTO swc_board_file (bf_Title, bf_Contents, userNo, regDatetime, bf_delflag) VALUES (#{reference.bf_Title}, #{reference.bf_Contents}, #{reference.userNo}, now(), 'n')")
    public int referenceInsert(@Param("reference") Reference reference);

    @Update("UPDATE swc_board_file SET bf_delflag = 'y' WHERE bf_pk = #{bf_pk}")
    public int referenceDelete(@Param("bf_pk") String bf_pk);

    @Update("UPDATE swc_board_file SET bf_Title = #{reference.bf_Title}, bf_Contents = #{reference.bf_Contents}, userNo = #{reference.userNo} WHERE bf_pk = #{reference.bf_pk}")
    public int updateReference(@Param("reference") Reference reference);

    @Select("SELECT fileId, fileName, fileDesc, userNo, regDatetime FROM swc_noticefiledata WHERE attrib NOT LIKE 'XXX%' AND bf_pk = #{bf_pk}")
    public List<NoticeFileData> getNoticeFileData(@Param("bf_pk") String bf_pk);

    @Select("SELECT * FROM swc_noticefiledata WHERE fileId = #{noticeFileData.fileId} AND bf_pk = #{noticeFileData.bf_pk}")
    public NoticeFileData downloadFile(@Param("noticeFileData") NoticeFileData noticeFileData);

    @Insert("INSERT INTO swc_noticefiledata (fileId, fileName, fileDesc, uploadDate, fileContent, fileSize, fileExtention, bf_pk, userNo, regDatetime, attrib) VALUES (#{noticeFileData.fileId}, #{noticeFileData.fileName}, #{noticeFileData.fileDesc}, now(), #{noticeFileData.fileContent}, #{noticeFileData.fileSize}, #{noticeFileData.fileExtention}, #{noticeFileData.bf_pk}, #{noticeFileData.userNo}, now(), '10000')")
    public int referenceFileInsert(@Param("noticeFileData") NoticeFileData noticeFileData);

    @Update("UPDATE swc_noticefiledata SET attrib = 'XXXXX' WHERE fileId = #{fileId}")
    public int referenceFileDelete(@Param("fileId") String fileId);
}
