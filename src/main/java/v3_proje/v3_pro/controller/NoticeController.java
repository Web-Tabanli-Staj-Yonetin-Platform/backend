package v3_proje.v3_pro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import v3_proje.v3_pro.DTO.notice.NoticeCreateDTO;
import v3_proje.v3_pro.DTO.notice.NoticeUpdateDTO;
import v3_proje.v3_pro.response.ResponseMessage;
import v3_proje.v3_pro.service.NoticeService;

@RestController
@RequestMapping("/api")
@CrossOrigin//(origins = "http://localhost:3000")
public class NoticeController {
	@Autowired
    private NoticeService noticeService;
    
    @PostMapping("/createNotice")
    public ResponseEntity<?> createNotice(@RequestBody NoticeCreateDTO noticeCreateDTO) {
    	try {
    		noticeService.createNotice(noticeCreateDTO);
			return new ResponseEntity<NoticeCreateDTO>(noticeCreateDTO, HttpStatus.OK);
		} catch (ResponseMessage e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
		}
    }

    @GetMapping("/getNotice/{id}")
    public ResponseEntity<?> getNoticeById(@PathVariable("id") String id) {
    	try {
			return new ResponseEntity<>(noticeService.getSingleNotice(id), HttpStatus.OK);
		} catch (ResponseMessage e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
		}
    }
    
    @PutMapping("/updateNotice/{id}")
    public ResponseEntity<?> updateNotice(@PathVariable("id") String id, @RequestBody NoticeUpdateDTO noticeUpdateDTO) {
        try {
        	noticeService.updateNotice(id, noticeUpdateDTO);
            return new ResponseEntity<>("Updated notice with id "+id+"", HttpStatus.OK);
        } catch (ResponseMessage e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } 
    }
    
    @DeleteMapping("/deleteNotice/{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id") String id) throws ResponseMessage{
		try{
			noticeService.deleteNotice(id);
            return new ResponseEntity<>("Successfully deleted notice with id "+id, HttpStatus.OK);
        }
        catch (ResponseMessage e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }	
	}
}
