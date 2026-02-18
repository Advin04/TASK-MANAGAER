import React, { useEffect } from 'react';
import { getAllProjects } from '../../redux/Slices/admin/projectSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProjectId } from '../../redux/Slices/admin/columnSlice';
import { Card, CardBody, CardHeader, Option, Select, Typography } from '@material-tailwind/react';
import { getAnalyticsData } from '../../redux/Slices/admin/analyticsSlice';
import Chart from "react-apexcharts";


export const Analytics = () => {
    const dispatch = useDispatch();
    const projectsList = useSelector((state) => state.adminProject.projectsList);
    const isSidebarCollapsed = useSelector((state) => state.global.isSidebarCollapsed);
    const isProjectSelected = useSelector((state) => state.adminColumns.isProjectSelected);
    const { priority, columns, taskPerColumn } = useSelector((state) => state.adminAnalytics)

    // Common options for dark mode visibility
    const commonOptions = {
        theme: {
            mode: 'dark'
        },
        chart: {
            background: 'transparent'
        },
        legend: {
            labels: {
                colors: '#ffffff'
            }
        }
    };

    const chartConfig = {
        series: taskPerColumn,
        options: {
            ...commonOptions,
            chart: {
                ...commonOptions.chart,
                width: 380,
                type: 'pie',
                toolbar: {
                    show: true,
                },
            },
            labels: columns,
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        }
    };

    const barChartConfig = {
        series: [{
            data: priority
        }],
        options: {
            ...commonOptions,
            chart: {
                ...commonOptions.chart,
                height: 350,
                type: 'bar',
            },
            colors: ["#e53935", "#fbc02d", "#43a047"],
            plotOptions: {
                bar: {
                    columnWidth: '45%',
                    distributed: true,
                }
            },
            dataLabels: {
                enabled: true
            },
            xaxis: {
                categories: ["High", "Medium", "Low"],
                labels: {
                    style: {
                        colors: ["#ffffff", "#ffffff", "#ffffff"],
                        fontSize: '12px'
                    }
                }
            }
        },
    }


    const selectedProject = useSelector((state) => state.adminColumns.filters.selectedProject);

    const handleProjectSelection = (projectId) => {
        dispatch(setSelectedProjectId(projectId));
    };

    useEffect(() => {
        dispatch(getAllProjects());
    }, [dispatch]);

    // Fetch analytics whenever the selected project changes
    useEffect(() => {
        if (selectedProject) {
            dispatch(getAnalyticsData(selectedProject));
        }
    }, [selectedProject, dispatch]);


    return (
        <div id="analytics-page">

            <div
                className={`absolute top-[90px] ${isSidebarCollapsed ? 'left-6' : 'left-72'} w-76`}
            >
                <Select variant="outlined" label={isProjectSelected ? "Change Project" : "Select Project"} onChange={handleProjectSelection}>
                    {projectsList.map((project) => (
                        <Option key={project._id} value={project._id}>
                            {project.name}
                        </Option>
                    ))}
                </Select>
            </div>

            {isProjectSelected && (
                <div className="pt-20 pl-6 flex gap-6">
                    <Card id="chart-tasks-per-column" className="bg-white dark:bg-dark-secondary border border-gray-100 dark:border-gray-900 shadow-sm transition-all duration-300">
                        <CardBody>
                            <Typography variant='h3' className="dark:text-white">
                                Tasks Per Column
                            </Typography>
                            <Chart
                                options={chartConfig.options}
                                series={chartConfig.series}
                                type="pie"
                                width="500"
                            />
                        </CardBody>
                    </Card>
                    <Card className="bg-white dark:bg-dark-secondary border border-gray-100 dark:border-gray-900 shadow-sm transition-all duration-300">
                        <CardBody>
                            <Typography variant='h3' className="dark:text-white">
                                Tasks Per Priority
                            </Typography>
                            <Chart options={barChartConfig.options} series={barChartConfig.series} type="bar" height={350} width={500} />
                        </CardBody>
                    </Card>

                </div>
            )}

        </div>
    )
}
