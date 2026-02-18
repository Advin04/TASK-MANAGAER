import React, { useEffect } from 'react'
import StatisticsCard from '../../components/common/StatisticsCard'
import { CalendarCheck, CalendarRange, ClipboardList, FileCheck2, FileClockIcon, FileCog2, FilePen } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { getDashboard, getDashboardTable } from '../../redux/Slices/admin/dashboardSlice';
import { Card, CardBody, CardHeader, Typography, Avatar, Tooltip, Progress } from '@material-tailwind/react';
import { motion } from 'framer-motion';

export const Dashboard = () => {

  const dispatch = useDispatch()
  const dashboardData = useSelector((state) => state.adminDashboard);
  const tableData = useSelector((state) => state.adminDashboard.tableData);

  useEffect(() => {
    dispatch(getDashboard());
    dispatch(getDashboardTable());
  }, [dispatch])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      id="dashboard-page"
      className='p-6 min-h-screen'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { title: "Total Tasks", value: dashboardData.totalTask, icon: <ClipboardList size={24} />, color: "bg-primary-700" },
          { title: "Todo Tasks", value: dashboardData.todoTask, icon: <FilePen size={24} />, color: "bg-blue-600" },
          { title: "In Progress", value: dashboardData.inProgressTask, icon: <FileCog2 size={24} />, color: "bg-yellow-600" },
          { title: "Completed", value: dashboardData.completedTask, icon: <FileCheck2 size={24} />, color: "bg-green-600" },
          { title: "Overdue", value: dashboardData.overDueTask, icon: <FileClockIcon size={24} />, color: "bg-red-600" }
        ].map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <StatisticsCard
              id={`stat-${stat.title.toLowerCase().replace(/ /g, '-')}`}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <StatisticsCard title={"Total Projects"} value={dashboardData.totalProjects} icon={<CalendarRange size={28} />} color={"bg-primary-600"} />
          <StatisticsCard title={"Completed Projects"} value={"0"} icon={<CalendarCheck size={28} />} color={"bg-emerald-600"} />
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="glass-card border-none overflow-hidden h-full">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 flex items-center justify-between p-6 pb-2"
            >
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1 text-gray-800 dark:text-white">
                  Active Projects
                </Typography>
                <Typography variant="small" className="text-gray-500 font-normal">
                  Overview of project progress and team members
                </Typography>
              </div>
            </CardHeader>
            <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["Project Name", "Team", "Manager", "Progress"].map(
                      (el) => (
                        <th
                          key={el}
                          className="border-b border-gray-100 dark:border-gray-900 py-3 px-6 text-left"
                        >
                          <Typography
                            variant="small"
                            className="text-[11px] font-bold uppercase text-gray-400"
                          >
                            {el}
                          </Typography>
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map(
                    (data, key) => {
                      const className = `py-3 px-6 ${key === tableData.length - 1
                        ? ""
                        : "border-b border-gray-50 dark:border-gray-900"
                        }`;
                      return (
                        <tr key={data.name} className="hover:bg-gray-50/50 dark:hover:bg-dark-secondary/50 transition-colors">
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              <Typography
                                variant="small"
                                className="font-bold text-gray-800 dark:text-white"
                              >
                                {data.name}
                              </Typography>
                            </div>
                          </td>
                          <td className={className}>
                            <div className="flex -space-x-2">
                              {data.members.map(({ name, email }, key) => (
                                <Tooltip key={name} content={name + " " + email} className="bg-gray-900 px-2 py-1 text-xs">
                                  <Avatar
                                    src={`https://ui-avatars.com/api/?background=random&name=${name}`}
                                    alt={name}
                                    size="xs"
                                    variant="circular"
                                    className={`cursor-pointer border-2 border-white dark:border-dark-bg hover:z-10 transition-all`}
                                  />
                                </Tooltip>
                              ))}
                            </div>
                          </td>
                          <td className={className}>
                            <Tooltip key={data.manager.name} content={data.manager.name + " " + data.manager.email} className="bg-gray-900 px-2 py-1 text-xs">
                              <Avatar
                                src={`https://ui-avatars.com/api/?background=random&name=${data.manager.name}`}
                                size="sm"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white dark:border-gray-800`}
                              />
                            </Tooltip>
                          </td>
                          <td className={className}>
                            <div className="w-10/12">
                              <div className="flex justify-between mb-1">
                                <Typography
                                  variant="small"
                                  className="block text-xs font-medium text-gray-600 dark:text-gray-400"
                                >
                                  {data.progress}%
                                </Typography>
                              </div>
                              <Progress
                                value={data.progress}
                                size="sm"
                                color={data.progress === 100 ? "green" : "indigo"}
                                className="bg-gray-100 dark:bg-dark-tertiary"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
