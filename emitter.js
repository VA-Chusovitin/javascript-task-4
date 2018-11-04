'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = {};

    function createEvent(context, handler, times = Infinity, frequency = 1) {
        return { context, handler, times, frequency, count: 0 };
    }

    function checkExistenceEvent(event) {
        if (!events[event]) {
            events[event] = [];
        }
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            checkExistenceEvent(event);
            events[event].push(createEvent(context, handler));

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            for (let key in events) {
                if (key === event || key.startsWith(event + '.')) {
                    events[key] = events[key].filter(element => element.context !== context);
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            do {
                if (events.hasOwnProperty(event)) {
                    events[event].forEach(element => {
                        if (element.times > 0 && element.count % element.frequency === 0) {
                            element.handler.call(element.context);
                            element.times--;
                        }
                        element.count++;
                    });
                }
                event = event.substring(0, event.lastIndexOf('.'));
            } while (event !== '');

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object} this
         */
        several: function (event, context, handler, times) {
            checkExistenceEvent(event);
            events[event].push(createEvent(context, handler, times));

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object} this
         */
        through: function (event, context, handler, frequency) {
            checkExistenceEvent(event);
            events[event].push(createEvent(context, handler, Infinity, frequency));

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
