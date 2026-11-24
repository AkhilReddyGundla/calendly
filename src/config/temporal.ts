import {Connection, Client} from '@temporalio/client'
import { TEMPORAL_ADDRESS, TEMPORAL_NAMESPACE } from './env';

let client:Client | null = null;

export const getTemporalClient = async(timeoutMs?: number)=>{
    if(client)return client;

    const connection = await Connection.connect({
        address: TEMPORAL_ADDRESS,
        connectTimeout: timeoutMs
    });

    client = new Client({
        connection,
        namespace: TEMPORAL_NAMESPACE,
    });

    return client;
}

export const disconnectTemporal = async()=>{
    if(client){
        await client.connection.close();
        client = null;
    }
}