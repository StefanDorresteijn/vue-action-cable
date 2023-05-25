import { createConsumer } from "@rails/actioncable"

export default class Cable {
    _connectionUrl = null
    connection = null

    constructor (Vue, options) {
        const VERSION = Number(Vue.version.split(".")[0]);
        if (VERSION === 3) {
            Vue.config.globalProperties.$cable = this;
        } else {
            Vue.prototype.$cable = this;
        }
        this.setConnectionUrl(options.connectionUrl)

        let { connectionUrl, connectImmediately } = options || {
            connectionUrl: null,
        };

        if (connectImmediately !== false) connectImmediately = true;

        if (connectImmediately) this.connect();
    }

    connect (token=null) {
        let paramString = ''

        if (token) {
            paramString = '?token=' + token
        }

        return createConsumer(this._connectionUrl + paramString)
    }

    useGlobalConnection (token=null) {
        if (!this.connection) {
            this.connection = this.connect(token)
        }

        return this.connection
    }

    disconnect () {
        if (this.connection) {
            this.connection.disconnect()
            this.connection = null
        }
    }

    setConnectionUrl (url) {
        this._connectionUrl = url
    }
}
