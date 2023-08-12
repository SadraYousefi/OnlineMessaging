import { Injectable } from "@nestjs/common";

@Injectable()
export class RoomService {
    private rooms: Map<string, Set<string>> = new Map(); 

    createUniqueRoom(user1: string, user2: string): string {
      const roomId = this.generateUniqueRoomId(user1, user2);
      this.rooms.set(roomId, new Set([user1, user2]));
      return roomId;
    }
  
    private generateUniqueRoomId(user1: string, user2: string): string {
      return user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
    }
}