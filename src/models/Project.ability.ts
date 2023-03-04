import { DefineAbility, Permissions } from "../types/Ability.js";
import { ProjectDocument } from "./Project/index.js";
import { IUser } from "./User.js";

const permissions: Permissions<ProjectDocument> = {
  "codr:admin": (user, { can }) => {
    can("manage", "Project");
  },
  "codr:researcher": (user, { can }) => {
    can("read", "Project", { private: false });
    can("read", "Project", { creator: user._id });
    can("update", "Project", { creator: user._id });
  },
  "codr:annotator": (user, { can }) => {
    can("read", "Project", { members: user._id });
  },
};

const ProjectAbility = (user: IUser) => DefineAbility(user, permissions);
export default ProjectAbility;
