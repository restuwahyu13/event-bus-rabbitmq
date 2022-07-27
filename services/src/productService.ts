import { RabbitMQ } from './rascal'

class ProductService {
	private static products: Record<string, any> = [
		{ id: 1, name: 'bawang', qty: 10, price: 5000 },
		{ id: 2, name: 'cabai', qty: 10, price: 10000 },
		{ id: 3, name: 'timun', qty: 10, price: 3000 },
		{ id: 4, name: 'wortel', qty: 10, price: 3000 },
		{ id: 5, name: 'terong', qty: 10, price: 1000 }
	]

	static async handler(): Promise<void> {
		const broker: InstanceType<typeof RabbitMQ> = new RabbitMQ('bus', 'event')
		const pub: boolean = await broker.publisher({ eventName: 'product-service', data: ProductService.products })

		if (pub) console.info(`publish product data success - ${new Date().toISOString()}`)
		else console.error(`publish product data error - ${new Date().toISOString()}`)
	}
}

// initialize and run broker
setInterval(() => {
	ProductService.handler()
}, 6000)
