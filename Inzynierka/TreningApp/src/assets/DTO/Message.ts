export default interface Message {
    id?: number;
    senderId:number;
    senderName:string;
    receiverName?:string;
    receiverId?:number;
    message:string;
    date:string;
    status:string;
    trainingId:number;
}