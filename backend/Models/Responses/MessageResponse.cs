namespace Mini_Marketplace.Models.Responses
{
    public class MessageResponse
    {
        public string Message { get; set; } = string.Empty;

        public MessageResponse(string message)
        {
            Message = message;
        }
    }
}