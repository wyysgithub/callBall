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
		cue:{
			default:null,
			type:cc.Node
		},
		// 拖动距离限制，小于则隐藏球杆
		min_dir:20
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
		this.body = this.getComponent(cc.RigidBody);
		
		this.cue_inst = this.cue.getComponent("cue");
		
		this.start_x = this.node.x;
		this.start_y = this.node.y;
		// start 点击下去 moved
		this.node.on(cc.Node.EventType.TOUCH_START,function(e){
			
		}.bind(this),this);
		//触摸移动
		this.node.on(cc.Node.EventType.TOUCH_MOVE,function(e){

			var w_pos = e.getLocation();
			//触摸位置
			var dst = this.node.parent.convertToNodeSpaceAR(w_pos);
			var src = this.node.getPosition()
			//两个点的距离计算
			//var dir = cc.pSub(dst, src);
			var dir = dst.sub(src)
			//var len = cc.pLength(dir);
			var len = dir.mag();
			if(len < this.min_dir){
				this.cue.active = false;
				return;
			}
			this.cue.active = true;
			
			var r = Math.atan2(dir.y, dir.x);
			var degree = r * 180 / Math.PI;
			degree = 360 - degree;
			//旋转角度
			this.cue.rotation = degree + 180;
			//球杆位置
			var cue_pos = dst;
			var cue_len_half = this.cue.width * 0.5;
			dst.x += (cue_len_half * dir.x /len);
			dst.y += (cue_len_half * dir.y /len);
			
			this.cue.setPosition(cue_pos)
			
			
		}.bind(this),this);
		//节点范围内弹起
		this.node.on(cc.Node.EventType.TOUCH_ENDED,function(e){
			if(this.cue.active === false){
				return;
			}
			this.cue_inst.shoot_at(this.node.getPosition())
		}.bind(this),this)
		//节点范围外弹起
		this.node.on(cc.Node.EventType.TOUCH_CANCEL,function(e){
			if(this.cue.active === false){
				return;
			}
			this.cue_inst.shoot_at(this.node.getPosition())
			
		}.bind(this),this)
		
    },
	
	reset:function(){
		this.node.x = this.start_x;
		this.node.y = this.start_y;
		this.node.scale = 1;
		
		this.body.linearVelocity = cc.v2(0,0)
		this.body.angularVelocity = 0;
		
	},
    // update (dt) {},
	
	    // 每次处理完碰撞体接触逻辑时被调用
    onBeginContact: function (contact, selfCollider, otherCollider) {
		
		//判断类型
		if(otherCollider.node.groupIndex === 2){
			this.node.scale = 0;
			//隔一秒放回白球
			this.scheduleOnce(this.reset.bind(this),1)
			return;
		}
    }
});
