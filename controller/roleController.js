const permissionsModel = require("../models/permissionModel");
const roleModel = require("../models/roleModel")

 const getAllRoles = async (req,res) => {
    try {
        const data = await roleModel.find({ roleType: 2 });
        if (!data) {
            return res.json({ message: "Unable to get data", status: 0 });
        }

        return res.status(200).json({ message: "Get data successfully", status: 1, data: data });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", status: 0 });
    }
}

const createRoles = async (req,res) => {
    try {
        const { roleName, permissions } = req.body;

        if (!roleName) {
            return res.json({ message: "Please provide role name !", status: 0 });
        }
        const role = new roleModel({ roleName });
        const roleData = await role.save();
        if (!roleData) {
            return res.json({ message: "Unable to get Role Id", status: 0 });
        }

        const formattedPermissions = permissions.map((ele) => {
            if (ele) {
                return (
                    {
                        menuId: ele[0],
                        service_1: ele.includes("Create") ? 1 : 0,
                        service_2: ele.includes("View") ? 1 : 0,
                        service_3: ele.includes("Update") ? 1 : 0,
                        service_4: ele.includes("Delete") ? 1 : 0,
                        service_5: ele.includes("Active/Inactive") ? 1 : 0,
                        roleId: roleData._id
                    }
                )
            }
        })

        await permissionsModel.insertMany(formattedPermissions);
        return res.json({ message: "Role created successfully.", status: 1 });
    } catch (err) {
        console.log(err);
        return res.json({ message: "Internal server error", status: 0 });
    }
}

module.exports = { createRoles,getAllRoles }