package v3_proje.v3_pro.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import v3_proje.v3_pro.DTO.notice.NoticeCreateDTO;
import v3_proje.v3_pro.DTO.notice.NoticeUpdateDTO;
import v3_proje.v3_pro.entity.Notice;
import v3_proje.v3_pro.repository.NoticeMongoRepository;
import v3_proje.v3_pro.response.ResponseMessage;
import v3_proje.v3_pro.service.NoticeService;

@Service
public class NoticeServiceImpl implements NoticeService{
	@Autowired
	private NoticeMongoRepository noticeMongoRepository;	
	
	@Override
	public Notice getSingleNotice(String id) throws ResponseMessage {
		Optional<Notice> noticeOptional = noticeMongoRepository.findById(id);
        if(!noticeOptional.isPresent()) {
        	throw new ResponseMessage(ResponseMessage.NotFoundException(id));
        }else {
        	return noticeOptional.get();
        }
	}

	@Override
	public void createNotice(NoticeCreateDTO noticeCreateDTO) throws ResponseMessage {	
		Notice notice = new Notice();
		notice.setName(noticeCreateDTO.getName());
		notice.setDescription(noticeCreateDTO.getDescription());
		notice.setWanted(noticeCreateDTO.getWanted());
		notice.setDepartment(noticeCreateDTO.getDepartment());
		noticeMongoRepository.save(notice);	
	}

	@Override
	public void updateNotice(String id, NoticeUpdateDTO noticeUpdateDTO) throws ResponseMessage {
		Optional<Notice> noticeWithId = noticeMongoRepository.findById(id);
	    if (noticeWithId.isPresent()) {
	        Notice noticeUpdate = noticeWithId.get();
	        noticeUpdate.setName(noticeUpdateDTO.getName());
	        noticeUpdate.setDescription(noticeUpdateDTO.getDescription());
	        noticeUpdate.setWanted(noticeUpdateDTO.getWanted());
	        noticeUpdate.setDepartment(noticeUpdateDTO.getDepartment());
	        noticeMongoRepository.save(noticeUpdate);
	    } else {
	        throw new ResponseMessage(ResponseMessage.NotFoundException(id));
	    }
	}

	@Override
	public void deleteNotice(String id) throws ResponseMessage {
		Optional<Notice> delOptional = noticeMongoRepository.findById(id);
		if(!delOptional.isPresent()) {
			throw new ResponseMessage(ResponseMessage.NotFoundException(id));
		}
		else {
			noticeMongoRepository.deleteById(id);
		}
	}

}
