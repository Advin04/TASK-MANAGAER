import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Progress,
} from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { setSelectedProjectId } from "../../redux/Slices/admin/columnSlice";
import ActivityLog from "./ActivityLog";

function ProjectCard({ project }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const viewBoard = () => {
    dispatch(setSelectedProjectId(project._id));
    navigate("/admin/tasks")
  }

  return (
    <>
      <Card className="mt-6 w-[340px] bg-white dark:bg-dark-secondary border border-gray-100 dark:border-gray-900 shadow-sm" key={project._id} value={project._id}>
        <CardBody>
          <div className="mb-2">
            <Typography variant="h4" color="blue-gray" className="mb-2 dark:text-white">
              {project.name}
            </Typography>
            <Typography variant="small" className="dark:text-gray-400">
              {project.description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum soluta, saepe consequatur nihil quidem aspernatur expedita quasi adipisci cumque magnam.
            </Typography>
          </div>
          <div className="w-full">
            <div className="flex items-center justify-between gap-4">
              <Typography color="blue-gray" variant="small" className="dark:text-gray-400">
                Progress
              </Typography>
              <Typography color="blue-gray" variant="small" className="dark:text-white font-bold">
                {project.progress}%
              </Typography>
            </div>
            <Progress value={project.progress} size="sm" color={project.progress > 66 ? "green" : project.progress > 34 ? "yellow" : "red"} />
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          <div className="flex items-center justify-between">
            <ActivityLog projectId={project._id} />
            <Button onClick={viewBoard} variant="text" color="blue">Task Board </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}

export default ProjectCard;