import { useState } from "react";
function Settings(){
    const[settings, setSettings]= useState({
        storeName: "ShopManager",
        ownerName: "Admin",
        email: "alfredyvictor281@gmail.com",
        phone: "+255 756 413 463",
        currency: "Tsh",
        notifications: true,
    });
    const [saved, setSaved]=useState(false);
    const handleChange= (e)=> {
        const {name, value, type, checked}=e.target;
        setSettings({
            ...settings,
            [name]: type=== "checkbox" ? checked :value,
        });
    };
    const handleSave=()=>{
        localStorage.setItem("shopSettings", JSON.stringify(settings));

        setSaved(true);
        setTimeout(()=>{
            setSaved(false);
        }, 2500);
    };

    return(
        <div className="settings-page">
            <div className="settings-header">
                <div>
                    <h1>Settings</h1>
                    <p>Manage your ShopManager preferences</p>
                </div>
            </div>
            {saved && (
                <div className="settings-success">
                    <i className="fa-solid fa-circle-check"></i>
                    Settings saved successfully
                </div>    
            )}
            <div className="settings-grid">

                {/*Store information*/}
               <div className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-card-icon">
                            <i className="fa-solid fa-store"></i>
                        </div>
                        <div>
                        <h2>Store Information</h2>
                        <p>Update your shop details</p>
                    </div>
                </div>
                <div className="settings-form">
                    <div className="form-group">
                        <label>Store Name</label>
                        <input type="text" name="storeName" value={settings.storeName}
                        onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Owner Name</label>
                        <input type="text" name="ownerName" value={settings.ownerName}
                        onChange={handleChange}
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={settings.email} onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                        <label>Phone</label>
                        <input type="text" name="phone" value={settings.phone} onChange={handleChange}
                        />
                        </div>
                    </div>
                </div>
            </div>
            {/*Preferences*/}
            <div className="settings-card">
                <div className="settings-card-header">
                    <div className="settings-card-icon">
                        <i className="fa-solid fa-sliders"></i>
                    </div>
                    <div>
                        <h2>Preferences</h2>
                        <p>Customize your system</p>
                    </div>
                </div>
                <div className="settings-form">
                    <div className="form-group">
                        <label>Currency</label>
                        <select name="currency" value={settings.currency} onChange={handleChange}>
                            <option value="Tsh">Tanzanian shilling(Tsh)</option>
                            <option value="USD">US Dollar($)</option>
                            <option value="EUR">EURO(£)</option>
                        </select>
                    </div>
                    <div className="setting-toogle">
                        <div>
                            <strong>Notifications</strong>
                            <p>Receive important shop notifications</p>
                        </div>
                        <label className="switch">
                            <input type="checkbox" name="notifications" checked={settings.notifications} onChange={handleChange}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div className="settings-actions">
            <button className="save-settings-btn" onClick={handleSave}>
                <i className="fa-solid fa-floppy-disk"></i>
                Save Settings
            </button>
        </div>
    </div> 
);
}
export default Settings;