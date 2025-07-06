import cron from 'node-cron';
import {AutoMessageService} from "@/modules/automessage/automessage.service";
import {module_check} from "@/main";

if (module_check("BASE")) {
    console.log("02:00 Cron initiated.")

    cron.schedule('0 2 * * *', async () => {
        console.log('Matching started...');
        await AutoMessageService.createDailyMatches();
    });
}
