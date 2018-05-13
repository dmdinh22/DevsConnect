import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class ProfileGithub extends Component {
	constructor(props) {
		super(props);
		this.state = {
			clientId: 'fb98affcde846359a7a8',
			clientSecret: '5dd6e3c772fca55d0fca499593acd3ecbed01859',
			count: 5,
			sort: 'created: asc',
			repos: []
		};
	}

	componentDidMount() {
		const { username } = this.props;
		const { count, sort, clientId, clientSecret } = this.state;

		fetch(
			`https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`
		)
			.then(result => result.json())
			.then(data => {
				if (this.refs.gitRef) {
					this.setState({ repos: data });
				}
			})
			.catch(error =>  console.log(error));
	}

	render() {
		const { repos } = this.state;
		const repoItems = repos.map(repo => (
			<div key={repo.id} className="card card-body mb-2">
				<div className="row">
					<div className="col-md-6">
						<h4>
							<Link to={repo.html_url} className="text-info" target="_blank">
								{repo.name}
							</Link>
						</h4>
						<p>{repo.description}</p>
						<div className="col-md-6">
							<span className="badge badge-info mr-1">
								Stars: {repo.stargazers_count}
							</span>
							<span className="badge badge-secondary mr-1">
								Watchers: {repo.watchers_count}
							</span>
							<span className="badge badge-success">
								Forks: {repo.forks_count}
							</span>
						</div>
					</div>
				</div>
			</div>
		));

		return (
			<div ref="gitRef">
				<hr />
				<h3 className="mb-4">Latest Github Repos</h3>
				{repoItems}
			</div>
		);
	}
}

ProfileGithub.propTypes = {
	username: PropTypes.string.isRequired
};

export default ProfileGithub;
