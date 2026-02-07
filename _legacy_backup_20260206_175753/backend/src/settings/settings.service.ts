import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppSetting } from './entities/app-setting.entity';

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(AppSetting)
        private settingRepository: Repository<AppSetting>,
    ) { }

    async findAll() {
        return this.settingRepository.find();
    }

    async findOne(key: string) {
        return this.settingRepository.findOneBy({ key });
    }

    async update(key: string, value: string) {
        const setting = await this.settingRepository.findOneBy({ key });
        if (setting) {
            setting.value = value;
            return this.settingRepository.save(setting);
        } else {
            // Create if not exists
            return this.settingRepository.save({ key, value });
        }
    }

    async initializeDefaults() {
        const defaults = [
            { key: 'COMPANY_NAME', value: 'My Company', description: 'Name displayed on invoices' },
            { key: 'TAX_RATE', value: '10', description: 'Default tax rate in percent' },
            { key: 'CURRENCY', value: 'USD', description: 'System currency' },
        ];

        for (const def of defaults) {
            const exists = await this.settingRepository.findOneBy({ key: def.key });
            if (!exists) {
                await this.settingRepository.save(def);
            }
        }
    }
}
