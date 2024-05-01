package v3_proje.v3_pro.service;

import v3_proje.v3_pro.DTO.notice.NoticeCreateDTO;
import v3_proje.v3_pro.DTO.notice.NoticeUpdateDTO;
import v3_proje.v3_pro.entity.Notice;
import v3_proje.v3_pro.response.ResponseMessage;

public interface NoticeService {
	public Notice getSingleNotice(String id) throws ResponseMessage;
	public void createNotice(NoticeCreateDTO noticeCreateDTO) throws ResponseMessage;
    public void updateNotice(String id, NoticeUpdateDTO noticeUpdateDTO) throws ResponseMessage;
    public void deleteNotice(String id) throws ResponseMessage;
}
