export const USER_ROLES = Object.freeze({
    ADMIN: 'admin',
    CUSTOMER: 'cliente',
    DRIVER: 'repartidor'
})

export const PRODUCT_STATUS = Object.freeze({
    AVAILABLE: 'disponible',
    OUT_OF_STOCK: 'sin_stock'
})

export const ESTADOS_PEDIDO = Object.freeze({
    CREADO: 'creado',
    ASIGNADO: 'asignado',
    RETIRADO: 'retirado',
    EN_TRANSITO: 'en_transito',
    ENTREGADO: 'entregado',
    CANCELADO: 'cancelado'
})

export const ESTADOS_ENTREGA = Object.freeze({
    ASIGNADA: 'asignada',
    EN_TRANSITO: 'en_transito',
    ENTREGADA: 'entregada',
    CANCELADA: 'cancelada'
})

export const PRIORIDAD_ENTREGA = Object.freeze({
    BAJA: 'baja',
    NORMAL: 'normal',
    ALTA: 'alta'
})