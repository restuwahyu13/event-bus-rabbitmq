import { RabbitMQ } from './rascal'

interface IResponse {
	eventName: string
	data: any
}

class ShippingOrder {
	static async handler(): Promise<void> {
		const broker: InstanceType<typeof RabbitMQ> = new RabbitMQ('sub:bus', 'event')

		broker.subscriber(async (content: IResponse, err: Error) => {
			if (!err && content && content.eventName === 'order-service') {
				console.info(`shipping order into client success - ${new Date().toISOString()}: `, content)
			} else {
				console.error('shipping order into client failed')
			}
		})
	}
}

// initialize and run broker
ShippingOrder.handler()
