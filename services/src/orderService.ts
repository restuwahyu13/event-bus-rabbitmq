import { RabbitMQ } from './rascal'

interface IResponse {
	eventName: string
	prefix: string
	data: any
}

class OrderService {
	private static randomId(): number {
		let uniqueId: number[] = [1, 2, 3, 4, 5]
		let numb: number = 1

		for (let i = 0; i < uniqueId.length; i++) {
			let random = Math.floor(Math.random() * uniqueId[i])
			if (!Number.isNaN(random)) {
				numb = uniqueId[random]
			}
		}
		return numb
	}

	static async handler(): Promise<void> {
		const broker: InstanceType<typeof RabbitMQ> = new RabbitMQ('sub:bus', 'event')

		broker.subscriber(async (content: IResponse, err: Error) => {
			if (!err && content && content.eventName === 'product-service') {
				const getProduct: Record<string, any> = content.data.find((val: Record<string, any>) => val.id === OrderService.randomId() && val)

				const orderData: Record<string, any> = {
					eventName: 'order-service',
					data: {
						from: {
							name: 'john doe',
							phone: '083887242891',
							address: 'Jl.Prapanca Raya RT01/RW04, Kec Kebayoran Lama, Jakarta Selatan 14436'
						},
						to: {
							name: 'jane doe',
							phone: '083887242892',
							address: 'Jl.Block M Timur RT05/RW03, Kec Kebayoran Lama, Jakarta Selatan 14436'
						},
						product: getProduct
					}
				}

				const broker: InstanceType<typeof RabbitMQ> = new RabbitMQ('pub:bus', 'event')
				const pub: boolean = await broker.publisher(orderData)

				if (pub) console.info(`order product processed success - ${new Date().toISOString()}: `, getProduct)
				else console.error(`order product processed failed - ${new Date().toISOString()}: `, getProduct)
			}
		})
	}
}

// initialize and run broker
OrderService.handler()
