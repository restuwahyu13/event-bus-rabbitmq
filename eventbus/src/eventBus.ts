import { RabbitMQ } from './rascal'

interface IBusEvent {
	eventName: string
	prefix: string
	data: any
}

class BusEvent {
	static event(): void {
		const sub: InstanceType<typeof RabbitMQ> = new RabbitMQ('bus', 'event')
		sub.subscriber(async (content: IBusEvent, err: Error) => {
			if (!err && content) {
				const broker: InstanceType<typeof RabbitMQ> = new RabbitMQ(content.eventName, content.prefix)
				const pub: boolean = await broker.publisher(content)

				if (pub) console.info(`send event to ${content.eventName}:${content.prefix} success`)
				else console.error(`send event to ${content.eventName}:${content.prefix} failed`)

				console.info('subscriber data success')
			} else {
				console.error('subscriber data failed')
			}
		})
	}
}

// initialize and run event bus
BusEvent.event()
