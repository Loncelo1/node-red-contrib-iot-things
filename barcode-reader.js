
module.exports = function(RED) {
    function BarcodeReader(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.number = config.number || 0; // Значение по умолчанию
        node.context().flow.set('autoGenerate', config.autoGenerate || false); // Используем flow контекст для хранения autoGenerate
        node.on('input', function(msg) {
            if(msg.hasOwnProperty('autoGenerate')) {
                node.context().flow.set('autoGenerate', msg.autoGenerate === 'true'); // Обновляем свойство autoGenerate в flow контексте
            } else if(!isNaN(msg.payload)) {
                node.number = Number(msg.payload); // Сохраняем число
                if(node.context().flow.get('autoGenerate')) {
                    node.number = Math.floor(1000000000 + Math.random() * 9000000000); // Генерируем число
                }
                msg.number = String(node.number); // Преобразуем число в строку и отправляем
            
                node.send(msg);
            }
        });
        node.on('close', function() {
            node.context().set('number', node.number); // Сохраняем число при закрытии
            node.context().flow.set('autoGenerate', config.autoGenerate);
        });
    }
    RED.nodes.registerType("Barcode Reader", BarcodeReader);
}
