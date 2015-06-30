var path = require('path');
// var knex = require('knex');

var db = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1', // will change for deployment
    port: '3306',
    user: 'codeus',
    password: 'kbscjm', // initials of our names
    database: 'codeusdb',
    charset: 'utf8',
    filename: path.join(__dirname, '../db/codeus.mysql')
  }
});

var bookshelf = require('bookshelf')(db);

db.schema.hasTable('coders').then(function(exists) {
  if (!exists) {
    db.schema.createTable('coders', function (coder) {
      coder.increments('id').primary();
      coder.string('login', 255);
      coder.string('name', 255);
      coder.string('photo_url', 255);
      coder.string('location', 255);
      coder.string('gh_member_since');
      coder.integer('stargazers_count');
      coder.integer('forks');
      coder.integer('watchers_count');
      coder.integer('downloads');
      coder.integer('cred');
      coder.string('gh_site_url', 255);
      coder.string('email', 255);
      // tier 2 attributes below
      coder.integer('collab_count');
      coder.string('primary_lang', 255);
      coder.integer('collab_per_repo');
      coder.integer('contrib_count');
      coder.string('commit_day_pattern', 255);
      coder.string('commit_hour_pattern', 255);
      coder.boolean('hireable');
      coder.string('organizations', 255);
      coder.string('so_location', 255);
      coder.string('so_name', 255);
      coder.string('so_member_since');
      coder.integer('so_reputation');
      coder.integer('so_answer_count');
      coder.integer('so_question_count');
      coder.integer('so_upvote_count');
      coder.string('so_site_url', 255);
      // creates created & modified timestamp columns
      coder.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.integer('coder_id');
      user.string('token');
      user.string('messages_url', 255);
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.schema.hasTable('languages').then(function(exists) {
  if (!exists) {
    db.schema.createTable('languages', function (user) {
      user.increments('id').primary();
      user.string('name');
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.schema.hasTable('coders_languages').then(function(exists) {
  if (!exists) {
    db.schema.createTable('coders_languages', function (language) {
      language.increments('id').primary();
      language.integer('coder_id');//.references('coders.id');
      language.integer('language_id');//.references('languages.id');
      language.integer('bytes_across_repos');
      language.integer('language_cred');
      language.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.schema.hasTable('technologies').then(function(exists) {
  if (!exists) {
    db.schema.createTable('technologies', function (tech) {
      tech.increments('id').primary();
      tech.string('name', 255);
      tech.string('language', 255);
      tech.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.schema.hasTable('technology_files').then(function(exists) {
  if (!exists) {
    db.schema.createTable('technology_files', function (file) {
      file.increments('id').primary();
      file.string('filename', 255);
      file.integer('filenologies_id');
      file.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.schema.hasTable('coders_technologies').then(function(exists) {
  if (!exists) {
    db.schema.createTable('coders_technologies', function (language) {
      language.increments('id').primary();
      language.integer('coder_id');
      language.integer('technology_id');
      language.integer('bytes_across_repos');
      language.integer('tech_cred');
      language.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

module.exports = bookshelf;