module.exports = function(RED) {
    function RemoteTerminalNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        // Initialize state
        node.status({ fill: "green", shape: "dot", text: "connected" });

        // Initialize button values
        config.button1 = 0;
        config.button2 = 0;
        config.button3 = 0;

        // Initialize text lines
        config.textLines = ["", "", "", ""];

        // On input message
        node.on('input', function(msg) {
            let payload = msg.payload;
        
            if (typeof payload === 'string') {
                let parts = payload.split(':');
                if (parts.length === 10) {
                    config.switch = parts[7];
                    if (config.switch == '0') {
                        // Если switch равен 0, установите все значения на 0 и текст на пустую строку
                        config.L1 = 0;
                        config.L2 = 0;
                        config.L3 = 0;
                        config.L4 = 0;
                        config.button1 = 0;
                        config.button2 = 0;
                        config.button3 = 0;
                        config.numberText = 0;
                        config.text = '';
                        config.textLines = ["", "", "", ""];
                    } else {
                        // Иначе, обработайте сообщение как обычно
                        config.L1 = !!parseInt(parts[0]);
                        config.L2 = !!parseInt(parts[1]);
                        config.L3 = !!parseInt(parts[2]);
                        config.L4 = !!parseInt(parts[3]);
                        let numberText = parseInt(parts[8]);
                        let text = parts[9];
                        config.numberText = parseInt(parts[8]);
                        config.text = parts[9];
                        // Обновите соответствующую текстовую строку
                        if (numberText >= 1 && numberText <= 4) {
                            config.textLines[numberText - 1] = text;
                        }
                    }
                }
            }
            

            // Update buttons counts
            if (msg.topic === "button1") config.button1 += 1;
            if (msg.topic === "button2") config.button2 += 1;
            if (msg.topic === "button3") config.button3 += 1;

            // Create new payload
            msg.payload = [
                config.L1 ? 1 : 0,
                config.L2 ? 1 : 0,
                config.L3 ? 1 : 0,
                config.L4 ? 1 : 0,
                config.button1,
                config.button2,
                config.button3,
                config.switch,
                config.numberText,
                config.text,
            ].join(':');
            msg.rTerminalText = config.textLines;
            // Send the text lines in a separate message
            node.send(msg);
        });
    }
    RED.nodes.registerType("remote terminal", RemoteTerminalNode);
}