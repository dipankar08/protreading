import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { CoreContext } from '../coreState/useCoreGlobalSate';
const { Header, Content, Footer } = Layout;

export type THomePageConfig ={
  title:string,
  subtitle:string,
}

type TProp ={
  homePageConfig:THomePageConfig,
  children:any
}


export const BaseHomePage =({homePageConfig, children}:TProp)=>{
  //let listMenu = homePageConfig.menuList.map((item,index)=><Button type="link" key={""+index}>{item.title}</Button>)
    const coreContext = React.useContext(CoreContext);
    const history = useHistory();
    useEffect(()=>{
      if(coreContext.state.loginInfo){
        history.replace("/home")
      } else {
        history.replace("/")
      }
    },[coreContext.state])
    
    const menu = (
      <Menu onClick={(key)=>{
        switch(key.key){
          case 'logout':
            coreContext.update({loginInfo:undefined})
            break;
        }
      }}>
        <Menu.Item key="logout" icon={<UserOutlined />}>
          Logout
        </Menu.Item>
        <Menu.Item key="profile" icon={<UserOutlined />}>
          profile
        </Menu.Item>
        <Menu.Item key="upgrade" icon={<UserOutlined />}>
          upgrade
        </Menu.Item>
      </Menu>
    );
    
    return( <div className="d_layout_col" >
        <div className="d_layout_row d_pv8 d_ph16" style={{height:40,zIndex:1, background:'black', color:'white', alignItems:'center', position:'fixed', width:'100%', top:0}}>
        <p className="d_text_title">{homePageConfig.title}</p>
        <p className="d_layout_space"></p>
        <Avatar shape="circle" src={coreContext.state.loginInfo?.profilePicture}/>
            <Dropdown.Button overlay={menu} placement="bottomCenter" icon={<UserOutlined />}>
        {coreContext.state.loginInfo?.name}
      </Dropdown.Button>
      </div>
      <div style={{marginTop:40}}>
          {children}
      </div>
    
    </div>)
}