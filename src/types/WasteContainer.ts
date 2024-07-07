import { t, Static } from 'elysia';

enum ContainerType {
    DEPO = "DEPO",
    TONG = "TONG"
}

enum ContainerStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED"
}

export const WasteContainerSchema = t.Object({
    id: t.Integer(),
    name: t.String({
        maxLength: 100
    }),
    type: t.Enum(ContainerType),
    rating: t.Number(),
    max_kg: t.Number(),
    max_vol: t.Number(),
    lat: t.Number(),
    long: t.Number(),
    cluster_id: t.Integer(),
    status: t.Enum(ContainerStatus)
})

export type WasteContainerType = Static<typeof WasteContainerSchema>;

