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
		value:1,
		AudioClip:{
			default: null,
            type: cc.AudioClip
		}
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad () {},

    start () {
		
		this.body = this.getComponent(cc.RigidBody);
		
		this.start_x = this.node.x;
		this.start_y = this.node.y;
    },
	reset(){
		this.node.active = true;
		this.node.x = this.start_x;
		this.node.y = this.start_y;
		
		this.body.linearVelocity = cc.v2(0,0)
		this.body.angularVelocity = 0;
	},
	// 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {

    },
	    // 每次处理完碰撞体接触逻辑时被调用
    onBeginContact: function (contact, selfCollider, otherCollider) {
				//播放音效
				if(otherCollider.node.groupIndex !== 1 && otherCollider.node.groupIndex !== 2){
							cc.audioEngine.play(this.AudioClip, false, 1);
				}
		//判断类型
		if(otherCollider.node.groupIndex === 2){
			this.node.active = false;
	
			return;
		}
    }
    // update (dt) {},
});
