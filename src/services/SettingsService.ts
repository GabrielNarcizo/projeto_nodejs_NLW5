import { getCustomRepository} from "typeorm";
import { SettingsRepository } from "../repositories/SettingsRepository"
import { Setting } from "../entities/Setting"

interface ISettingsCreate {
    chat: boolean;
    username: string;
}


class SettingsService {

    async create({ chat, username } : ISettingsCreate)  {
        const settingsRepository = getCustomRepository(SettingsRepository)

        const userAlreadyExists = await settingsRepository.findOne({
            username
        });

        if(userAlreadyExists) {
            throw new Error("User already exists")
        }
        
        const settings = settingsRepository.create({
            chat,
            username,
        })

        await settingsRepository.save(settings)
        
        return settings;
    }

    async findByUsername (username: string) {
        const settingsRepository = getCustomRepository(SettingsRepository)

        const settings = await settingsRepository.findOne({
            username
        })

        return settings;
    }

    async update(username: string, chat: boolean) {
        const settingsRepository = getCustomRepository(SettingsRepository)

        const settings = await settingsRepository.createQueryBuilder().update(Setting)
        .set({chat})
        .where("username = :username" , {
            username
        }).execute();

    }
}

export { SettingsService }