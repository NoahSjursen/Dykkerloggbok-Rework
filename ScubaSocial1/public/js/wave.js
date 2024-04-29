document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('oceanCanvas');
    var ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Define properties for the waves
    var waveAmplitude = 40;
    var waveFrequency = 0.01;
    var waveOffset = 0;
    var secondWaveOffset = 0;
    var thirdWaveOffset = 0; // Offset for the third wave
    var waveSpeed = 0.02;
    var secondWaveSpeed = -0.02;
    var thirdWaveSpeed = -0.01; // Negative speed for the opposite direction
    var verticalOffset = 0;
    var verticalSpeed = 0.005; // Adjust the speed as needed

    function drawWave() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate vertical offset
        verticalOffset += verticalSpeed;
        var yOffset = Math.sin(verticalOffset) * 10; // Adjust the amplitude as needed

        // First wave
        ctx.beginPath();
        for (var x = 0; x < canvas.width; x++) {
            var y = waveAmplitude * Math.sin(x * waveFrequency + waveOffset) + (canvas.height / 2) + yOffset;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = 'deepskyblue';
        ctx.fill();

        // Second wave
        ctx.beginPath();
        for (var x = 0; x < canvas.width; x++) {
            var y = (waveAmplitude - 10) * Math.sin(x * (waveFrequency - 0.002) + secondWaveOffset) + (canvas.height / 2) + yOffset;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = 'deepskyblue';
        ctx.fill();

        // Third wave on top, moving in the opposite direction
        ctx.beginPath();
        for (var x = 0; x < canvas.width; x++) {
            var y = (waveAmplitude - 20) * Math.sin(x * (waveFrequency + 0.004) + thirdWaveOffset) + (canvas.height / 2) + yOffset;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = 'deepskyblue';
        ctx.fill();
        ctx.globalAlpha = 1.0; // Reset the globalAlpha

        // Increment offsets
        waveOffset += waveSpeed;
        secondWaveOffset += secondWaveSpeed;
        thirdWaveOffset += thirdWaveSpeed;

        requestAnimationFrame(drawWave);
    }

    drawWave();
});
