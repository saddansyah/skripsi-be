import { t } from 'elysia'
import { WasteClusterPayloadType } from '../types/WasteCluster';

const makeOptional = (schema: any) => {
    // console.log(typeof schema);
    const newSchema: any = {};
    for (const key in schema.shape) {
        if (schema.shape.hasOwnProperty(key)) {
            newSchema[key] = t.Optional(schema.shape[key]);
        }
    }
    return t.Object(newSchema);
};

console.log(makeOptional(WasteClusterPayloadType));