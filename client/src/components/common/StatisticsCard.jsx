import { Card, CardBody, Typography } from '@material-tailwind/react'
import React from 'react'

const StatisticsCard = ({ icon, title, value, color }) => {
    return (
        <Card className="bg-white dark:bg-dark-secondary border border-gray-100 dark:border-gray-900 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <CardBody className="p-4 flex items-center justify-between">
                <div className={`p-4 rounded-xl text-white shadow-lg ${color} bg-opacity-90`}>
                    {icon}
                </div>
                <div className="text-right">
                    <Typography className="font-medium text-gray-500 dark:text-gray-400 text-sm mb-1">
                        {title}
                    </Typography>
                    <Typography variant="h3" color="blue-gray" className="font-bold text-gray-800 dark:text-white">
                        {value}
                    </Typography>
                </div>
            </CardBody>
        </Card>
    )
}

export default StatisticsCard