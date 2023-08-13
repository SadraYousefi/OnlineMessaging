import { Injectable } from "@nestjs/common";
import * as fs from 'fs-extra';
import { join } from "path";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  "../../../public"
    private readonly uploadPath = join(__dirname , ".." , ".." , ".." , ".." , "uploads")

    async writeBinaryToFile(filePath: string, binaryData: Buffer): Promise<void> {
      try {
        await fs.writeFile(filePath, binaryData);
      } catch (error) {
        console.error('Error writing binary data:', error);
        throw new Error('Failed to write binary data to file.');
      }
    }

    folderPathGenerator(conversationId: string): string {
      const folderPath = join(this.uploadPath , conversationId)
      fs.ensureDirSync(folderPath) ;
      return folderPath
    }

    filePathGenerator(pathArg: number[] , extName: string): string {

      const conversationId = pathArg[0] > pathArg[1] ? `${pathArg[1]}_${pathArg[0]}` : `${pathArg[0]}_${pathArg[1]}`
      const folderPath = this.folderPathGenerator(conversationId)
      const uniqueFileName = `${uuidv4()}${extName}` 
      return join(folderPath , uniqueFileName )
    }
  }