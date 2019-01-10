"use strict"

Vue.component('meme-component', {
	template: `<div  v-on:click="sendmemeurl(meme)" class="meme-box">
	  <img crossOrigin="Anonymous" :src="meme.url" alt="Image">
	<p><strong>{{meme.name}}</strong></p>	
	</div>`,
	props: {
		meme: Object
	},
	methods: {
		sendmemeurl: function (meme) {
			this.$emit('memeclicked', meme.url);
		}
	}
});
var app = new Vue({
	el: "#app",
	data: {
		toptext: "",
		bottomtext: "",
		memes: {},
		memeurl: ''
	},
	methods: {
		loadCanvas: function () {
			let topText = this.toptext ? this.toptext : "TOP TEXT GOES HERE";
			let bottomText = this.bottomtext ? this.bottomtext : "BOTTOM TEXT GOES HERE";
			let memeurl = this.memeurl;

			function wrapText(context, text, x, y, maxWidth, lineHeight) {
				var words = text.split(' ');
				var line = '';

				for (var n = 0; n < words.length; n++) {
					var testLine = line + words[n] + ' ';
					var metrics = context.measureText(testLine);
					var testWidth = metrics.width;
					if (testWidth > maxWidth && n > 0) {
						context.fillText(line, x, y);
						line = words[n] + ' ';
						y += lineHeight;
					} else {
						line = testLine;
					}
				}

				context.strokeStyle = 'black';
				context.fillText(line, x, y);
				context.strokeText(line, x, y);
				context.stroke();
			}
			var c = document.getElementById("canvas");
			var ctx = c.getContext("2d");
			var img = new Image;
			img.src = memeurl;
			img.onload = function () {
				ctx.drawImage(img, 0, 0, c.width, c.height);
				ctx.font = "30px Impact";
				ctx.fillStyle = "white";
				ctx.textAlign = "center";
				wrapText(ctx, topText, canvas.width / 2, 40, 500, 30)
				wrapText(ctx, bottomText, canvas.width / 2, canvas.height - 40, 500, 30)
			}
		},
		loadMemes: function () {
			fetch("https://api.imgflip.com/get_memes")
				.then(response => response.json())
				.then(data => {
					this.memes = data.data.memes;
				})
		},
		memeRecieved(value) {
			this.memeurl = value;
			this.loadCanvas();
		}
	},
	beforeMount() {
		this.loadMemes()
	}
})