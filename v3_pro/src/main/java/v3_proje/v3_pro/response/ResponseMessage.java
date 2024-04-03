package v3_proje.v3_pro.response;

public class ResponseMessage extends Exception{
	private static final long serialVersionUID = 1L;
	
	public ResponseMessage(String message) {
		super(message);
	}
	
	public static String NotFoundException(String id) {
		return "User with "+id+" not found!";
	}
	
	public static String AlreadyExistsException() {
		return "User with given name already exists";
	}
}
