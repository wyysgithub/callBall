// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
		shoot_power:10,
		AudioClip:{
			default: null,
            type: cc.AudioClip
		}
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
       this.body = this.getComponent(cc.RigidBody);
    },
	shoot_at:function(dst){
		//冲量:一个方向的冲量,矢量，大小，方向 src -- > dst
		var src = this.node.getPosition();
		var dir = dst.sub(src);
		
		//大小
		var cue_len_half = this.node.width * 0.5;
		var len = dir.mag();
		var distance = len - cue_len_half;
		
		var power_x = distance * this.shoot_power * dir.x / len;
		var power_y = distance * this.shoot_power * dir.y / len;
		//applyLinearImpulse（冲量大小向量 球杆的原点转成世界坐标，true）
		this.body.applyLinearImpulse(cc.p(power_x,power_y),this.node.convertToWorldSpaceAR(cc.p(0,0)),true);
	},
	// 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
		//播放音效
		//cc.audioEngine.play(cc.url.raw("resources/ball.mp3"));
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
				//播放音效
		cc.audioEngine.play(this.AudioClip, false, 1);
		this.node.active = false;
    }

    // update (dt) {},
});
